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
  
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.totacompania.fr';
  if (path.startsWith('/uploads/')) {
    return cdnUrl + path.replace('/uploads/', '/');
  }
  return path;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const spectacle = await Spectacle.findOne({
      slug: params.slug,
      $or: [
        { available: true },
        { published: true }
      ]
    }).lean();

    if (!spectacle) {
      return NextResponse.json({ error: 'Spectacle not found' }, { status: 404 });
    }

    const spec = spectacle as any;

    // Collect all media IDs that need to be resolved
    const mediaIds = new Set<string>();
    if (spec.image && isValidObjectId(spec.image)) {
      mediaIds.add(spec.image);
    }
    if (spec.dossierUrl && isValidObjectId(spec.dossierUrl)) {
      mediaIds.add(spec.dossierUrl);
    }
    if (spec.gallery) {
      spec.gallery.forEach((img: string) => {
        if (isValidObjectId(img)) {
          mediaIds.add(img);
        }
      });
    }

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

    // Resolve main image
    let mainImage = spec.image;
    if (mainImage && isValidObjectId(mainImage)) {
      mainImage = mediaMap.get(mainImage) || '';
    } else if (mainImage) {
      mainImage = getCdnUrl(mainImage);
    }

    // Fallback to first gallery image if main is placeholder or empty
    if ((!mainImage || mainImage === getCdnUrl(placeholderImage)) && spec.gallery && spec.gallery.length > 0) {
      const firstGallery = spec.gallery[0];
      if (isValidObjectId(firstGallery)) {
        mainImage = mediaMap.get(firstGallery) || '';
      } else {
        mainImage = getCdnUrl(firstGallery);
      }
    }

    // Resolve gallery images
    const resolvedGallery = spec.gallery?.map((img: string) => {
      if (isValidObjectId(img)) {
        return mediaMap.get(img) || '';
      }
      return getCdnUrl(img);
    }).filter(Boolean) || [];

    // Resolve dossier URL
    let dossierUrl = spec.dossierUrl;
    if (dossierUrl && isValidObjectId(dossierUrl)) {
      dossierUrl = mediaMap.get(dossierUrl) || '';
    } else if (dossierUrl) {
      dossierUrl = getCdnUrl(dossierUrl);
    }

    // Decode HTML entities in text fields
    const cleanedSpectacle = {
      ...spec,
      title: decodeHtmlEntities(spec.title),
      subtitle: spec.subtitle ? decodeHtmlEntities(spec.subtitle) : undefined,
      description: decodeHtmlEntities(spec.description),
      longDescription: spec.longDescription ? decodeHtmlEntities(spec.longDescription) : undefined,
      content: spec.content ? decodeHtmlEntities(spec.content) : undefined,
      audience: spec.audience ? decodeHtmlEntities(spec.audience) : undefined,
      ageRange: spec.ageRange ? decodeHtmlEntities(spec.ageRange) : undefined,
      cast: spec.cast ? decodeHtmlEntities(spec.cast) : undefined,
      technicalInfo: spec.technicalInfo ? decodeHtmlEntities(spec.technicalInfo) : undefined,
      image: mainImage,
      gallery: resolvedGallery,
      partenaires: spec.partenaires || [],
      distribution: spec.distribution ? decodeHtmlEntities(spec.distribution) : undefined,
      dossierUrl: dossierUrl,
    };

    return NextResponse.json(cleanedSpectacle);
  } catch (error) {
    console.error('Error fetching spectacle:', error);
    return NextResponse.json({ error: 'Failed to fetch spectacle' }, { status: 500 });
  }
}
