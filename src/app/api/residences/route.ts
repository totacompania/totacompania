export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Résidence } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const résidences = await Résidence.find({ published: true }).sort({ order: 1, year: -1 });
    return NextResponse.json(résidences);
  } catch (error) {
    console.error('Error fetching résidences:', error);
    return NextResponse.json({ error: 'Failed to fetch résidences' }, { status: 500 });
  }
}
