import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Festival } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const festivals = await Festival.find({ active: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(festivals);
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return NextResponse.json({ error: 'Failed to fetch festivals' }, { status: 500 });
  }
}
