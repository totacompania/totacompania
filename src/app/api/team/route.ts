export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamMember, Media } from '@/models';

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
      query['roles.category'] = category;
    }

    const members = await TeamMember.find(query).sort({ order: 1, createdAt: -1 }).lean();

    // Fetch media paths and format roles for display
    const membersWithImages = await Promise.all(
      members.map(async (member) => {
        let imagePath = member.imagePath || null;

        if (member.mediaId && !imagePath) {
          const media = await Media.findById(member.mediaId).lean();
          imagePath = media?.path || null;
        }

        // Transform to CDN URL
        if (imagePath) {
          imagePath = getCdnUrl(imagePath);
        }

        const matchingRole = category
          ? member.roles?.find((r: { category: string }) => r.category === category)
          : member.roles?.[0];

        const allRoles = member.roles?.map((r: { title: string }) => r.title).join(', ') || '';

        return {
          ...member,
          imagePath,
          photo: imagePath,
          role: matchingRole?.title || allRoles,
          category: matchingRole?.category || member.roles?.[0]?.category || 'equipe'
        };
      })
    );

    return NextResponse.json(membersWithImages);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}
