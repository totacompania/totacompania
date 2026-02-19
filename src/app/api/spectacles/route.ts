import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle, Media } from '@/models';
import { decodeHtmlEntities } from '@/lib/utils';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// Helper to check if a string is a valid MongoDB ObjectId
function isValidObjectId(str: string): boolean {
  return mongoose.Types.ObjectId.isValid(str) && str.length === 24;
}

// Helper to get CDN URL
function getCdnUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'https://tota.boris-henne.fr';
  if (path.startsWith('/uploads/')) {
    return cdnUrl + path;
  }
  return path;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    // Return spectacles that are available OR published
    const result = await Spectacle.find({
      $or: [
        { available: true },
        { published: true }
      ]
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    // Collect all media IDs that need to be resolved
    const mediaIds = new Set<string>();
    result.forEach((spectacle: any) => {
      if (spectacle.image && isValidObjectId(spectacle.image)) {
        mediaIds.add(spectacle.image);
      }
      if (spectacle.gallery) {
        spectacle.gallery.forEach((img: string) => {
          if (isValidObjectId(img)) {
            mediaIds.add(img);
          }
        });
      }
    });

    // Fetch all media documents in one query
    const mediaMap = new Map<string, string>();
    if (mediaIds.size > 0) {
      const mediaDocuments = await Media.find({
        _id: { $in: Array.from(mediaIds) }
      }).select('_id url path').lean();
      
      mediaDocuments.forEach((doc: any) => {
        const url = doc.url || doc.path || '';
        mediaMap.set(doc._id.toString(), getCdnUrl(url));
      });
    }

    // Image placeholder connue
    const placeholderImage = '/uploads/1766753592428-et4925.png';

    // Decode HTML entities and resolve image IDs to URLs
    const cleanedResult = result.map((spectacle: any) => {
      // Resolve main image
      let mainImage = spectacle.image;
      if (mainImage && isValidObjectId(mainImage)) {
        mainImage = mediaMap.get(mainImage) || '';
      } else if (mainImage) {
        mainImage = getCdnUrl(mainImage);
      }
      
      // Fallback to first gallery image if main is placeholder or empty
      if ((!mainImage || mainImage === getCdnUrl(placeholderImage)) && spectacle.gallery && spectacle.gallery.length > 0) {
        const firstGallery = spectacle.gallery[0];
        if (isValidObjectId(firstGallery)) {
          mainImage = mediaMap.get(firstGallery) || '';
        } else {
          mainImage = getCdnUrl(firstGallery);
        }
      }

      // Resolve gallery images
      const resolvedGallery = spectacle.gallery?.map((img: string) => {
        if (isValidObjectId(img)) {
          return mediaMap.get(img) || '';
        }
        return getCdnUrl(img);
      }).filter(Boolean) || [];

      return {
        ...spectacle,
        title: decodeHtmlEntities(spectacle.title),
        subtitle: spectacle.subtitle ? decodeHtmlEntities(spectacle.subtitle) : undefined,
        description: decodeHtmlEntities(spectacle.description),
        audience: spectacle.audience ? decodeHtmlEntities(spectacle.audience) : undefined,
        ageRange: spectacle.ageRange ? decodeHtmlEntities(spectacle.ageRange) : undefined,
        image: mainImage,
        gallery: resolvedGallery,
      };
    });

    return NextResponse.json(cleanedResult);
  } catch (error) {
    console.error('Error fetching spectacles:', error);
    return NextResponse.json({ error: 'Failed to fetch spectacles' }, { status: 500 });
  }
}
