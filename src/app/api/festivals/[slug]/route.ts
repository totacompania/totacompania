import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Festival } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const festival = await Festival.findOne({ slug, active: true });

    if (!festival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json(festival);
  } catch (error) {
    console.error('Error fetching festival:', error);
    return NextResponse.json({ error: 'Failed to fetch festival' }, { status: 500 });
  }
}
