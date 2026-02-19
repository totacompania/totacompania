import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle, Media } from '@/models';
import { decodeHtmlEntities } from '@/lib/utils';

function getCdnUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cdnUrl = 'https://tota.boris-henne.fr';
  if (path.startsWith('/uploads/')) return cdnUrl + path;
  return path;
}

function isObjectId(s: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(s);
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const total = await Spectacle.countDocuments(query);
    const result = await Spectacle.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Collect all ObjectId references from image and gallery fields
    const mediaIds: string[] = [];
    for (const spectacle of result) {
      const doc = spectacle.toObject();
      if (doc.image && isObjectId(doc.image)) mediaIds.push(doc.image);
      (doc.gallery || []).forEach((img: string) => {
        if (isObjectId(img)) mediaIds.push(img);
      });
    }

    // Batch resolve ObjectIds to CDN URLs
    const mediaMap = new Map<string, string>();
    if (mediaIds.length > 0) {
      const uniqueIds = Array.from(new Set(mediaIds));
      const mediaItems = await Media.find({ _id: { $in: uniqueIds } }).select('url path');
      for (const item of mediaItems) {
        const url = item.url || item.path || '';
        mediaMap.set(item._id.toString(), getCdnUrl(url));
      }
    }

    // Resolve an image field to a displayable URL
    const resolveImage = (image?: string): string => {
      if (!image) return '';
      if (isObjectId(image)) return mediaMap.get(image) || '';
      if (image.startsWith('/uploads/')) return getCdnUrl(image);
      return image;
    };

    // Transform data for admin with proper image URLs and decoded HTML entities
    const spectaclesWithImages = result.map((spectacle: any) => {
      const doc = spectacle.toObject();
      return {
        ...doc,
        id: doc._id.toString(),
        title: decodeHtmlEntities(doc.title),
        subtitle: decodeHtmlEntities(doc.subtitle || ''),
        description: decodeHtmlEntities(doc.description),
        image: resolveImage(doc.image),
        gallery: (doc.gallery || []).map((img: string) => resolveImage(img)),
        published: doc.available !== false,
      };
    });

    return NextResponse.json({
      data: spectaclesWithImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching spectacles:', error);
    return NextResponse.json({ error: 'Failed to fetch spectacles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const spectacle = new Spectacle({
      slug: body.slug,
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      longDescription: body.content || body.longDescription,
      content: body.content,
      image: body.image,
      ageRange: body.audience || body.ageRange || 'Tout public',
      audience: body.audience,
      duration: body.duration,
      gallery: body.gallery || [],
      category: body.category || 'spectacle',
      available: body.published !== false,
      published: body.published !== false,
      featured: body.featured || false,
      cast: body.cast,
      technicalInfo: body.technicalInfo,
      videoUrl: body.videoUrl,
      distribution: body.distribution,
      partenaires: body.partenaires || [],
      dossierUrl: body.dossierUrl,
      order: body.order || 0,
    });

    await spectacle.save();
    return NextResponse.json(spectacle, { status: 201 });
  } catch (error) {
    console.error('Error creating spectacle:', error);
    return NextResponse.json({ error: 'Failed to create spectacle' }, { status: 500 });
  }
}
