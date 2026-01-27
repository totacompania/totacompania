import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamMember, Media } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query: Record<string, unknown> = { active: true };
    if (category) {
      // Search in roles array for matching category
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

        // Get the role for this category (for backward compat)
        const matchingRole = category
          ? member.roles?.find((r: { category: string }) => r.category === category)
          : member.roles?.[0];

        // Get all roles as a formatted string
        const allRoles = member.roles?.map((r: { title: string }) => r.title).join(', ') || '';

        return {
          ...member,
          imagePath,
          // For backward compatibility: single role field
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
