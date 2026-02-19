export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Partner, Media } from '@/models';

// Helper to get CDN URL
function getCdnUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const cdnUrl = 'https://tota.boris-henne.fr';
    if (path.startsWith('/uploads/')) {
          return cdnUrl + path;
    }
    return path;
}

export async function GET(request: NextRequest) {
    try {
          await connectDB();
          const { searchParams } = new URL(request.url);
          const category = searchParams.get('category');

      const query: Record<string, unknown> = { active: true };
          if (category) {
                  query.category = category;
          }

      const partners = await Partner.find(query).sort({ order: 1, createdAt: -1 }).lean();

      // Fetch media paths for partners with mediaId and transform to CDN URL
      const partnersWithLogos = await Promise.all(
              partners.map(async (partner) => {
                        let logoPath = partner.logo || null;

                                   if (partner.mediaId && !logoPath) {
                                               const media = await Media.findById(partner.mediaId).lean();
                                               logoPath = media?.path || media?.url || null;
                                   }

                                   // Transform to CDN URL
                                   if (logoPath) {
                                               logoPath = getCdnUrl(logoPath);
                                   }

                                   return {
                                               ...partner,
                                               logoPath
                                   };
              })
            );

      return NextResponse.json(partnersWithLogos);
    } catch (error) {
          console.error('Error fetching partners:', error);
          return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
    }
}
