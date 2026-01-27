import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamMember } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: Record<string, unknown> = {};
    if (category) {
      // Search in roles array for matching category
      query['roles.category'] = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await TeamMember.countDocuments(query);
    const members = await TeamMember.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Add backward-compatible role and category fields
    const membersWithCompat = members.map((member) => {
      const firstRole = member.roles?.[0];
      const allRoles = member.roles?.map((r: { title: string }) => r.title).join(', ') || '';
      return {
        ...member,
        role: firstRole?.title || allRoles,
        category: firstRole?.category || 'equipe'
      };
    });

    return NextResponse.json({
      data: membersWithCompat,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Handle both old format (role/category) and new format (roles array)
    let roles = body.roles;
    if (!roles && body.role) {
      roles = [{ title: body.role, category: body.category || 'equipe' }];
    }

    const member = new TeamMember({
      name: body.name,
      roles: roles || [],
      bio: body.bio,
      image: body.image,
      imagePath: body.imagePath,
      mediaId: body.mediaId,
      order: body.order || 0,
      active: body.active !== false,
    });

    await member.save();
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
