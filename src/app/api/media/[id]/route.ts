import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Get the host from headers for proper redirect
    const host = request.headers.get('host') || 'localhost:3101';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const redirectUrl = `${protocol}://${host}${media.path}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
