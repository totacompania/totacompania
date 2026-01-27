import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Setting, Media } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await connectDB();
    const { key } = params;
    const setting = await Setting.findOne({ key });

    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    // Parse JSON values
    if (setting.type === 'json') {
      try {
        const parsed = JSON.parse(setting.value);

        // If parsed value has mediaId, fetch the image path
        if (parsed.mediaId) {
          const media = await Media.findById(parsed.mediaId).lean();
          if (media) {
            parsed.imagePath = media.path;
          }
        }

        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ value: setting.value });
      }
    }

    return NextResponse.json({ value: setting.value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await connectDB();
    const { key } = params;
    const body = await request.json();
    
    const type = typeof body.value === 'object' ? 'json' : typeof body.value;
    const stringValue = type === 'json' ? JSON.stringify(body.value) : String(body.value);
    
    await Setting.findOneAndUpdate(
      { key },
      { key, value: stringValue, type },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
