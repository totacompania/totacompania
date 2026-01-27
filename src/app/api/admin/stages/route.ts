import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Stage } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const stages = await Stage.find().sort({ order: 1, startDate: -1 });
    return NextResponse.json(stages);
  } catch (error) {
    console.error('Error fetching stages:', error);
    return NextResponse.json({ error: 'Failed to fetch stages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const stage = new Stage({
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
      published: body.published !== false,
      order: body.order || 0,
    });

    await stage.save();
    return NextResponse.json(stage, { status: 201 });
  } catch (error) {
    console.error('Error creating stage:', error);
    return NextResponse.json({ error: 'Failed to create stage' }, { status: 500 });
  }
}
