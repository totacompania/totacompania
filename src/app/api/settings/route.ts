import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Setting } from '@/models';

export const dynamic = 'force-dynamic';

// GET all settings
export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.find({});
    const settingsMap: Record<string, any> = {};

    settings.forEach(setting => {
      let value: any = setting.value;
      if (setting.type === 'json') {
        try { value = JSON.parse(setting.value); } catch {}
      } else if (setting.type === 'number') {
        value = Number(setting.value);
      } else if (setting.type === 'boolean') {
        value = setting.value === 'true';
      }
      settingsMap[setting.key] = value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST to update settings
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      const type = typeof value === 'object' ? 'json' : typeof value as any;
      const stringValue = type === 'json' ? JSON.stringify(value) : String(value);

      await Setting.findOneAndUpdate(
        { key },
        { key, value: stringValue, type },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
