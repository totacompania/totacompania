import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// POST: Migrate old format to new format and merge duplicates
export async function POST() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }
    const collection = db.collection('teammembers');

    // Step 1: Migrate old format (role/category) to new format (roles array)
    const oldFormatMembers = await collection.find({
      role: { $exists: true },
      roles: { $exists: false }
    }).toArray();

    let migratedCount = 0;
    for (const member of oldFormatMembers) {
      await collection.updateOne(
        { _id: member._id },
        {
          $set: {
            roles: [{ title: member.role, category: member.category || 'equipe' }]
          },
          $unset: { role: '', category: '' }
        }
      );
      migratedCount++;
    }

    // Step 2: Also migrate members with empty roles array
    const emptyRolesMembers = await collection.find({
      role: { $exists: true },
      roles: { $size: 0 }
    }).toArray();

    for (const member of emptyRolesMembers) {
      if (member.role) {
        await collection.updateOne(
          { _id: member._id },
          {
            $set: {
              roles: [{ title: member.role, category: member.category || 'equipe' }]
            },
            $unset: { role: '', category: '' }
          }
        );
        migratedCount++;
      }
    }

    // Step 3: Find and merge duplicates by name
    const allMembers = await collection.find({}).toArray();
    const byName: Record<string, typeof allMembers> = {};

    for (const member of allMembers) {
      const name = member.name.trim().toLowerCase();
      if (!byName[name]) {
        byName[name] = [];
      }
      byName[name].push(member);
    }

    let mergedCount = 0;
    const mergeResults: Array<{ name: string; rolesCount: number; duplicatesRemoved: number }> = [];

    for (const name of Object.keys(byName)) {
      const members = byName[name];
      if (members.length > 1) {
        // Find the best member to keep (one with media/image)
        const sorted = members.sort((a, b) => {
          const aHasMedia = a.mediaId || a.imagePath ? 1 : 0;
          const bHasMedia = b.mediaId || b.imagePath ? 1 : 0;
          return bHasMedia - aHasMedia;
        });

        const primary = sorted[0];
        const duplicates = sorted.slice(1);

        // Merge all roles from duplicates into primary
        const allRoles: Array<{ title: string; category: string }> = [...(primary.roles || [])];
        for (const dup of duplicates) {
          for (const role of (dup.roles || [])) {
            // Check if this role already exists
            const exists = allRoles.some(
              r => r.category === role.category && r.title === role.title
            );
            if (!exists) {
              allRoles.push(role);
            }
          }
        }

        // Update primary with merged roles
        await collection.updateOne(
          { _id: primary._id },
          { $set: { roles: allRoles } }
        );

        // Delete duplicates
        for (const dup of duplicates) {
          await collection.deleteOne({ _id: dup._id });
          mergedCount++;
        }

        mergeResults.push({
          name: primary.name,
          rolesCount: allRoles.length,
          duplicatesRemoved: duplicates.length
        });
      }
    }

    return NextResponse.json({
      success: true,
      migrated: migratedCount,
      merged: mergedCount,
      mergeDetails: mergeResults
    });
  } catch (error) {
    console.error('Error migrating team members:', error);
    return NextResponse.json({ error: 'Failed to migrate team members' }, { status: 500 });
  }
}

// GET: Preview migration without making changes
export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }
    const collection = db.collection('teammembers');

    // Find members that need migration
    const oldFormatMembers = await collection.find({
      role: { $exists: true }
    }).toArray();

    // Find duplicates
    const allMembers = await collection.find({}).toArray();
    const byName: Record<string, typeof allMembers> = {};

    for (const member of allMembers) {
      const name = member.name.trim().toLowerCase();
      if (!byName[name]) {
        byName[name] = [];
      }
      byName[name].push(member);
    }

    const duplicates: Array<{ name: string; count: number; roles: string[] }> = [];
    for (const name of Object.keys(byName)) {
      const members = byName[name];
      if (members.length > 1) {
        duplicates.push({
          name: members[0].name,
          count: members.length,
          roles: members.map(m =>
            m.role || (m.roles || []).map((r: { title: string }) => r.title).join(', ')
          )
        });
      }
    }

    return NextResponse.json({
      needsMigration: oldFormatMembers.length,
      duplicates: duplicates,
      totalMembers: allMembers.length
    });
  } catch (error) {
    console.error('Error previewing migration:', error);
    return NextResponse.json({ error: 'Failed to preview migration' }, { status: 500 });
  }
}
