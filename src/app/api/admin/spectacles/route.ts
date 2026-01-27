import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle } from '@/models';
import { decodeHtmlEntities } from '@/lib/utils';

// Helper pour transformer l'image en URL utilisable
const getImageUrl = (image?: string): string => {
  if (!image) return '';
  // Si c'est deja une URL complete ou un chemin absolu
  if (image.startsWith('/') || image.startsWith('http')) return image;
  // Sinon c'est un ID MongoDB, on le transforme en URL media
  return `/media/${image}`;
};

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

    // Transformer les donnees pour l'admin avec les bonnes URLs d'images et decoder les entites HTML
    const spectaclesWithImages = result.map((spectacle: any) => {
      const doc = spectacle.toObject();
      return {
        ...doc,
        id: doc._id.toString(),
        title: decodeHtmlEntities(doc.title),
        subtitle: decodeHtmlEntities(doc.subtitle || ''),
        description: decodeHtmlEntities(doc.description),
        image: getImageUrl(doc.image),
        gallery: (doc.gallery || []).map((img: string) => getImageUrl(img)),
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
