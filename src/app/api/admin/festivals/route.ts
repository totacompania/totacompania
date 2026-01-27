import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Festival } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const festivals = await Festival.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(festivals);
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return NextResponse.json({ error: 'Failed to fetch festivals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const festival = new Festival({
      slug: body.slug,
      name: body.name,
      subtitle: body.subtitle,
      description: body.description,
      longDescription: body.longDescription,
      image: body.image,
      mediaId: body.mediaId,
      startDate: body.startDate,
      endDate: body.endDate,
      active: body.active !== false,
      order: body.order || 0,
    });

    await festival.save();
    return NextResponse.json(festival, { status: 201 });
  } catch (error) {
    console.error('Error creating festival:', error);
    return NextResponse.json({ error: 'Failed to create festival' }, { status: 500 });
  }
}
