import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamMember, Media } from '@/models';

// POST: Clear invalid mediaIds from team members
export async function POST() {
  try {
    await connectDB();

    // Get all team members with mediaId
    const membersWithMedia = await TeamMember.find({ mediaId: { $exists: true, $ne: null } });

    let cleared = 0;
    let valid = 0;

    for (const member of membersWithMedia) {
      // Check if the mediaId exists in Media collection
      const media = await Media.findById(member.mediaId);

      if (!media) {
        // Clear invalid mediaId
        await TeamMember.updateOne(
          { _id: member._id },
          { $unset: { mediaId: 1 } }
        );
        cleared++;
      } else {
        valid++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Nettoyage termine: ${cleared} mediaIds invalides supprimes, ${valid} valides conserves`,
      cleared,
      valid,
      total: membersWithMedia.length
    });
  } catch (error) {
    console.error('Error fixing team images:', error);
    return NextResponse.json({ error: 'Failed to fix team images' }, { status: 500 });
  }
}

// GET: Check status of team member images
export async function GET() {
  try {
    await connectDB();

    const allMembers = await TeamMember.find({});
    const membersWithMedia = await TeamMember.find({ mediaId: { $exists: true, $ne: null } });

    const results = [];
    let validCount = 0;
    let invalidCount = 0;

    for (const member of membersWithMedia) {
      const media = await Media.findById(member.mediaId);
      if (media) {
        validCount++;
        results.push({ name: member.name, status: 'valid', mediaPath: media.path });
      } else {
        invalidCount++;
        results.push({ name: member.name, status: 'invalid', mediaId: member.mediaId });
      }
    }

    return NextResponse.json({
      totalMembers: allMembers.length,
      withMediaId: membersWithMedia.length,
      validMedia: validCount,
      invalidMedia: invalidCount,
      details: results
    });
  } catch (error) {
    console.error('Error checking team images:', error);
    return NextResponse.json({ error: 'Failed to check team images' }, { status: 500 });
  }
}
