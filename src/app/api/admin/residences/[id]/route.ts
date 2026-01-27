import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Résidence } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const résidence = await Résidence.findById(id);

    if (!résidence) {
      return NextResponse.json({ error: 'Résidence not found' }, { status: 404 });
    }

    return NextResponse.json(résidence);
  } catch (error) {
    console.error('Error fetching résidence:', error);
    return NextResponse.json({ error: 'Failed to fetch résidence' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const résidence = await Résidence.findByIdAndUpdate(
      id,
      {
        name: body.name,
        artist: body.artist,
        year: body.year,
        description: body.description,
        image: body.image,
        mediaId: body.mediaId,
        startDate: body.startDate,
        endDate: body.endDate,
        rendezVous: body.rendezVous,
        published: body.published,
        order: body.order,
      },
      { new: true }
    );

    if (!résidence) {
      return NextResponse.json({ error: 'Résidence not found' }, { status: 404 });
    }

    return NextResponse.json(résidence);
  } catch (error) {
    console.error('Error updating résidence:', error);
    return NextResponse.json({ error: 'Failed to update résidence' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const résidence = await Résidence.findByIdAndDelete(id);

    if (!résidence) {
      return NextResponse.json({ error: 'Résidence not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting résidence:', error);
    return NextResponse.json({ error: 'Failed to delete résidence' }, { status: 500 });
  }
}
