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

    // Build update object with only provided fields to avoid wiping data
    const update: Record<string, unknown> = {};
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.title !== undefined) update.title = body.title;
    if (body.subtitle !== undefined) update.subtitle = body.subtitle;
    if (body.description !== undefined) update.description = body.description;
    if (body.content !== undefined || body.longDescription !== undefined) {
      update.longDescription = body.content || body.longDescription;
      update.content = body.content || body.longDescription;
    }
    if (body.image !== undefined) update.image = body.image;
    if (body.gallery !== undefined) update.gallery = body.gallery;
    if (body.duration !== undefined) update.duration = body.duration;
    if (body.audience !== undefined) {
      update.audience = body.audience;
      update.ageRange = body.audience;
    }
    if (body.ageRange !== undefined) update.ageRange = body.ageRange;
    if (body.cast !== undefined) update.cast = body.cast;
    if (body.technicalInfo !== undefined) update.technicalInfo = body.technicalInfo;
    if (body.videoUrl !== undefined) update.videoUrl = body.videoUrl;
    if (body.distribution !== undefined) update.distribution = body.distribution;
    if (body.partenaires !== undefined) update.partenaires = body.partenaires;
    if (body.dossierUrl !== undefined) update.dossierUrl = body.dossierUrl;
    if (body.published !== undefined) {
      update.published = body.published;
      update.available = body.published;
    }
    if (body.available !== undefined) {
      update.available = body.available;
      update.published = body.available;
    }
    if (body.featured !== undefined) update.featured = body.featured;
    if (body.category !== undefined) update.category = body.category;

    const spectacle = await Spectacle.findByIdAndUpdate(
      params.id,
      { $set: update },
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
