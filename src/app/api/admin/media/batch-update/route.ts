import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';

// POST /api/admin/media/batch-update - Update multiple média items at once
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const updates: Record<string, { tags?: string[], alt?: string, category?: string }> = await request.json();

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const [id, data] of Object.entries(updates)) {
      try {
        const updateData: Record<string, unknown> = {};
        if (data.tags) updateData.tags = data.tags;
        if (data.alt) updateData.alt = data.alt;
        if (data.category) updateData.category = data.category;

        await Media.findByIdAndUpdate(id, updateData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json(
      { error: 'Failed to batch update media' },
      { status: 500 }
    );
  }
}
