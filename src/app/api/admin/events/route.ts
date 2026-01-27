import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const total = await Event.countDocuments(query);
    const result = await Event.find(query)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('spectacleId');

    // Transformer les donnees pour l'admin avec les bons champs
    const eventsForAdmin = result.map((event: any) => {
      const doc = event.toObject();
      return {
        ...doc,
        id: doc._id.toString(),
        date: doc.date?.toISOString().split('T')[0] || '',
        endDate: doc.endDate?.toISOString().split('T')[0],
      };
    });

    return NextResponse.json({
      data: eventsForAdmin,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const event = new Event({
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
      ageRange: body.ageRange,
      type: body.type || 'spectacle',
      image: body.image,
      spectacleId: body.spectacleId,
      published: body.published !== false,
    });

    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
