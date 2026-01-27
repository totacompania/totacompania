import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const spectacle = await Spectacle.findById(params.id);
    if (!spectacle) {
      return NextResponse.json({ error: 'Spectacle not found' }, { status: 404 });
    }
    return NextResponse.json(spectacle);
  } catch (error) {
    console.error('Error fetching spectacle:', error);
    return NextResponse.json({ error: 'Failed to fetch spectacle' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const spectacle = await Spectacle.findByIdAndUpdate(
      params.id,
      {
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        longDescription: body.content || body.longDescription,
        content: body.content,
        image: body.image,
        gallery: body.gallery || [],
        duration: body.duration,
        audience: body.audience,
        ageRange: body.audience || body.ageRange,
        cast: body.cast,
        technicalInfo: body.technicalInfo,
        videoUrl: body.videoUrl,
        distribution: body.distribution,
        partenaires: body.partenaires || [],
        dossierUrl: body.dossierUrl,
        published: body.published,
        available: body.published,
        featured: body.featured,
        category: body.category,
      },
      { new: true }
    );

    if (!spectacle) {
      return NextResponse.json({ error: 'Spectacle not found' }, { status: 404 });
    }
    return NextResponse.json(spectacle);
  } catch (error) {
    console.error('Error updating spectacle:', error);
    return NextResponse.json({ error: 'Failed to update spectacle' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Spectacle.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting spectacle:', error);
    return NextResponse.json({ error: 'Failed to delete spectacle' }, { status: 500 });
  }
}
