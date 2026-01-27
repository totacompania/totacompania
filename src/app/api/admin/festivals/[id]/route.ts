import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Festival } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const festival = await Festival.findById(id);

    if (!festival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json(festival);
  } catch (error) {
    console.error('Error fetching festival:', error);
    return NextResponse.json({ error: 'Failed to fetch festival' }, { status: 500 });
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

    const festival = await Festival.findByIdAndUpdate(
      id,
      {
        slug: body.slug,
        name: body.name,
        subtitle: body.subtitle,
        description: body.description,
        longDescription: body.longDescription,
        image: body.image,
        mediaId: body.mediaId,
        startDate: body.startDate,
        endDate: body.endDate,
        active: body.active,
        order: body.order,
      },
      { new: true }
    );

    if (!festival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json(festival);
  } catch (error) {
    console.error('Error updating festival:', error);
    return NextResponse.json({ error: 'Failed to update festival' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const festival = await Festival.findByIdAndDelete(id);

    if (!festival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting festival:', error);
    return NextResponse.json({ error: 'Failed to delete festival' }, { status: 500 });
  }
}
