import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Résidence } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const résidences = await Résidence.find().sort({ order: 1, year: -1 });
    return NextResponse.json(résidences);
  } catch (error) {
    console.error('Error fetching résidences:', error);
    return NextResponse.json({ error: 'Failed to fetch résidences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const résidence = new Résidence({
      name: body.name,
      artist: body.artist,
      year: body.year,
      description: body.description,
      image: body.image,
      mediaId: body.mediaId,
      startDate: body.startDate,
      endDate: body.endDate,
      rendezVous: body.rendezVous,
      published: body.published !== false,
      order: body.order || 0,
    });

    await résidence.save();
    return NextResponse.json(résidence, { status: 201 });
  } catch (error) {
    console.error('Error creating résidence:', error);
    return NextResponse.json({ error: 'Failed to create résidence' }, { status: 500 });
  }
}
