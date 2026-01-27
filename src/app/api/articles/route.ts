import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Article } from '@/models';

export async function GET() {
  try {
    await connectDB();
    // Only return published articles for public API
    const result = await Article.find({ published: true }).sort({ publishedAt: -1 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
