import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle, Event, Message, Media } from '@/models';

export async function GET() {
  try {
    await connectDB();

    const [spectacles, events, messagesUnread, mediaCount] = await Promise.all([
      Spectacle.countDocuments(),
      Event.countDocuments(),
      Message.countDocuments({ read: false }),
      Media.countDocuments()
    ]);

    return NextResponse.json({
      spectacles,
      events,
      messages: messagesUnread,
      media: mediaCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
