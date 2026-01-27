import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id).populate('spectacleId');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const event = await Event.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        time: body.time,
        endTime: body.endTime,
        location: body.location,
        address: body.address,
        price: body.price,
        ticketUrl: body.ticketUrl,
        externalUrl: body.externalUrl,
        ageRange: body.ageRange,
        type: body.type,
        image: body.image,
        spectacleId: body.spectacleId,
        published: body.published,
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findByIdAndDelete(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
