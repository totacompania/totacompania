import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';

// Helper to get CDN URL
function getCdnUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'https://tota.boris-henne.fr';
  if (path.startsWith('/uploads/')) {
    return cdnUrl + path;
  }
  return path;
}

// GET - Redirect to CDN URL for the media file
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

    // Get the CDN URL
    const mediaUrl = media.url || media.path || '';
    const cdnUrl = getCdnUrl(mediaUrl);

    if (!cdnUrl) {
      return NextResponse.json({ error: 'Media URL not found' }, { status: 404 });
    }

    // Redirect to CDN
    return NextResponse.redirect(cdnUrl, 301);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
