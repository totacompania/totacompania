import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Setting } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const result = await Setting.find();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Update or insert each setting
    for (const [key, value] of Object.entries(body)) {
      let type: 'string' | 'boolean' | 'number' | 'json' = 'string';
      let stringValue = String(value);

      if (typeof value === 'boolean') {
        type = 'boolean';
        stringValue = value ? 'true' : 'false';
      } else if (typeof value === 'number') {
        type = 'number';
        stringValue = String(value);
      } else if (typeof value === 'object') {
        type = 'json';
        stringValue = JSON.stringify(value);
      }

      await Setting.findOneAndUpdate(
        { key },
        { key, value: stringValue, type },
        { upsert: true, new: true }
      );
    }

    // Return updated settings
    const result = await Setting.find();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
