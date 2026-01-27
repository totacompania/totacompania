import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const past = searchParams.get('past') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');

    let query: any = { published: true };

    if (upcoming) {
      query.date = { $gte: new Date() };
    } else if (past) {
      query.date = { $lt: new Date() };
    }
    // Si ni upcoming ni past, on retourné tous les événements

    if (type) {
      query.type = type;
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(limit)
      .populate('spectacleId');

    // Transformer les dates pour le frontend
    const formattedEvents = events.map((event: any) => {
      const doc = event.toObject();
      return {
        ...doc,
        date: doc.date?.toISOString() || '',
        endDate: doc.endDate?.toISOString(),
      };
    });

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
