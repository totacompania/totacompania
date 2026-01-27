import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TheaterGroup } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const group = await TheaterGroup.findById(params.id);

    if (!group) {
      return NextResponse.json({ error: 'Theater group not found' }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error fetching theater group:', error);
    return NextResponse.json({ error: 'Failed to fetch theater group' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const group = await TheaterGroup.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        ageRange: body.ageRange,
        description: body.description,
        schedule: body.schedule,
        location: body.location,
        price: body.price,
        memberPrice: body.memberPrice,
        color: body.color,
        order: body.order,
        active: body.active,
      },
      { new: true }
    );

    if (!group) {
      return NextResponse.json({ error: 'Theater group not found' }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error updating theater group:', error);
    return NextResponse.json({ error: 'Failed to update theater group' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const group = await TheaterGroup.findByIdAndDelete(params.id);

    if (!group) {
      return NextResponse.json({ error: 'Theater group not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Theater group deleted successfully' });
  } catch (error) {
    console.error('Error deleting theater group:', error);
    return NextResponse.json({ error: 'Failed to delete theater group' }, { status: 500 });
  }
}
