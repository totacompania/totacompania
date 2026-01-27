import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle } from '@/models';
import { decodeHtmlEntities } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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

    // Image placeholder connue
    const placeholderImage = '/uploads/1766753592428-et4925.png';

    // Utilise la premiere image de la galerie si l'image principale est le placeholder
    let mainImage = (spectacle as any).image;
    if (mainImage === placeholderImage && (spectacle as any).gallery && (spectacle as any).gallery.length > 0) {
      mainImage = (spectacle as any).gallery[0];
    }

    // Decode HTML entities in text fields
    const cleanedSpectacle = {
      ...(spectacle as any),
      title: decodeHtmlEntities((spectacle as any).title),
      subtitle: (spectacle as any).subtitle ? decodeHtmlEntities((spectacle as any).subtitle) : undefined,
      description: decodeHtmlEntities((spectacle as any).description),
      longDescription: (spectacle as any).longDescription ? decodeHtmlEntities((spectacle as any).longDescription) : undefined,
      content: (spectacle as any).content ? decodeHtmlEntities((spectacle as any).content) : undefined,
      audience: (spectacle as any).audience ? decodeHtmlEntities((spectacle as any).audience) : undefined,
      ageRange: (spectacle as any).ageRange ? decodeHtmlEntities((spectacle as any).ageRange) : undefined,
      cast: (spectacle as any).cast ? decodeHtmlEntities((spectacle as any).cast) : undefined,
      technicalInfo: (spectacle as any).technicalInfo ? decodeHtmlEntities((spectacle as any).technicalInfo) : undefined,
      image: mainImage,
      partenaires: (spectacle as any).partenaires || [],
      distribution: (spectacle as any).distribution ? decodeHtmlEntities((spectacle as any).distribution) : undefined,
      dossierUrl: (spectacle as any).dossierUrl,
    };

    return NextResponse.json(cleanedSpectacle);
  } catch (error) {
    console.error('Error fetching spectacle:', error);
    return NextResponse.json({ error: 'Failed to fetch spectacle' }, { status: 500 });
  }
}
