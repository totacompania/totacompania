import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Partner, Media } from '@/models';

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

    // Fetch média paths for partners with mediaId
    const partnersWithLogos = await Promise.all(
      partners.map(async (partner) => {
        if (partner.mediaId) {
          const media = await Media.findById(partner.mediaId).lean();
          return {
            ...partner,
            logoPath: media?.path || null
          };
        }
        return partner;
      })
    );

    return NextResponse.json(partnersWithLogos);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}
