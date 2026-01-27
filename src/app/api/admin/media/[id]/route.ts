import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET single média by ID
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

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// PUT update média metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = ['originalName', 'alt', 'caption', 'category', 'tags', 'folder', 'showInGallery'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const media = await Media.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// DELETE media
export async function DELETE(
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

    // Check if média is used somewhere
    if (media.usedIn && media.usedIn.length > 0) {
      return NextResponse.json({
        error: 'Media is in use',
        usedIn: media.usedIn,
      }, { status: 400 });
    }

    // Delete file from disk
    const filepath = join(process.cwd(), 'public', media.path);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Delete thumbnail if exists
    if (media.thumbnailPath) {
      const thumbPath = join(process.cwd(), 'public', media.thumbnailPath);
      if (existsSync(thumbPath)) {
        await unlink(thumbPath);
      }
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
