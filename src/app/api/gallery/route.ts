export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query = {
      showInGallery: true,
      mimeType: { $regex: /^image\// }
    };

    const [result, total] = await Promise.all([
      Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Media.countDocuments(query)
    ]);

    // Transform URLs to use CDN
    const transformedResult = result.map((media: any) => ({
      ...media,
      url: getCdnUrl(media.url || media.path || ''),
      path: getCdnUrl(media.path || media.url || '')
    }));

    return NextResponse.json({
      data: transformedResult,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
