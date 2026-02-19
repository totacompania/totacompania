import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import { Stage } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const stages = await Stage.find({ published: true }).sort({ order: 1, startDate: 1 });
    return NextResponse.json(stages);
  } catch (error) {
    console.error('Error fetching stages:', error);
    return NextResponse.json({ error: 'Failed to fetch stages' }, { status: 500 });
  }
}
