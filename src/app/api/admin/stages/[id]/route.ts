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

    const stage = await Stage.findByIdAndUpdate(
      id,
      {
        title: body.title,
        theme: body.theme,
        description: body.description,
        ageRange: body.ageRange,
        startDate: body.startDate,
        endDate: body.endDate,
        location: body.location,
        price: body.price,
        maxParticipants: body.maxParticipants,
        mediaId: body.mediaId,
        published: body.published,
        order: body.order,
      },
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
