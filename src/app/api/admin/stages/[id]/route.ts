import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Stage } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const stage = await Stage.findById(id);

    if (!stage) {
      return NextResponse.json({ error: 'Stage not found' }, { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error fetching stage:', error);
    return NextResponse.json({ error: 'Failed to fetch stage' }, { status: 500 });
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

    // Build update object with only provided fields to avoid wiping data
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.theme !== undefined) update.theme = body.theme;
    if (body.description !== undefined) update.description = body.description;
    if (body.ageRange !== undefined) update.ageRange = body.ageRange;
    if (body.startDate !== undefined) update.startDate = body.startDate;
    if (body.endDate !== undefined) update.endDate = body.endDate;
    if (body.location !== undefined) update.location = body.location;
    if (body.price !== undefined) update.price = body.price;
    if (body.maxParticipants !== undefined) update.maxParticipants = body.maxParticipants;
    if (body.mediaId !== undefined) update.mediaId = body.mediaId;
    if (body.published !== undefined) update.published = body.published;
    if (body.order !== undefined) update.order = body.order;

    const stage = await Stage.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!stage) {
      return NextResponse.json({ error: 'Stage not found' }, { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error updating stage:', error);
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const stage = await Stage.findByIdAndDelete(id);

    if (!stage) {
      return NextResponse.json({ error: 'Stage not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stage:', error);
    return NextResponse.json({ error: 'Failed to delete stage' }, { status: 500 });
  }
}
