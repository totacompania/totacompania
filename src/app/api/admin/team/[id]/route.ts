import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamMember } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const member = await TeamMember.findById(id);

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.imagePath !== undefined) updateData.imagePath = body.imagePath;
    if (body.mediaId !== undefined) updateData.mediaId = body.mediaId;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.active !== undefined) updateData.active = body.active;

    // Handle roles
    if (body.roles !== undefined) {
      updateData.roles = body.roles;
    } else if (body.role !== undefined) {
      // Legacy: if single role/category provided, add to roles array
      const currentMember = await TeamMember.findById(id);
      if (currentMember) {
        const existingRoles = currentMember.roles || [];
        const category = body.category || 'equipe';
        // Check if this category role already exists
        const roleExists = existingRoles.some((r: { category: string }) => r.category === category);
        if (!roleExists) {
          updateData.roles = [...existingRoles, { title: body.role, category }];
        } else {
          // Update existing role for this category
          updateData.roles = existingRoles.map((r: { title: string; category: string }) =>
            r.category === category ? { ...r, title: body.role } : r
          );
        }
      }
    }

    const member = await TeamMember.findByIdAndUpdate(id, updateData, { new: true });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const member = await TeamMember.findByIdAndDelete(id);

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
