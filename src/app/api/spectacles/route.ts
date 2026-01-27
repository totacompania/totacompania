import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle } from '@/models';
import { decodeHtmlEntities } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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

    // Image placeholder connue (a remplacer par la premiere image de la galerie)
    const placeholderImage = '/uploads/1766753592428-et4925.png';

    // Decode HTML entities in text fields and fix placeholder images
    const cleanedResult = result.map((spectacle: any) => {
      // Utilise la premiere image de la galerie si l'image principale est le placeholder
      let mainImage = spectacle.image;
      if (mainImage === placeholderImage && spectacle.gallery && spectacle.gallery.length > 0) {
        mainImage = spectacle.gallery[0];
      }

      return {
        ...spectacle,
        title: decodeHtmlEntities(spectacle.title),
        subtitle: spectacle.subtitle ? decodeHtmlEntities(spectacle.subtitle) : undefined,
        description: decodeHtmlEntities(spectacle.description),
        audience: spectacle.audience ? decodeHtmlEntities(spectacle.audience) : undefined,
        ageRange: spectacle.ageRange ? decodeHtmlEntities(spectacle.ageRange) : undefined,
        image: mainImage,
      };
    });

    return NextResponse.json(cleanedResult);
  } catch (error) {
    console.error('Error fetching spectacles:', error);
    return NextResponse.json({ error: 'Failed to fetch spectacles' }, { status: 500 });
  }
}
