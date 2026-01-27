import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TheaterGroup } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const groups = await TheaterGroup.find(query).sort({ order: 1 });

    return NextResponse.json({
      data: groups,
      total: groups.length
    });
  } catch (error) {
    console.error('Error fetching theater groups:', error);
    return NextResponse.json({ error: 'Failed to fetch theater groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Trouver l'ordre max pour le nouveau groupe
    const maxOrder = await TheaterGroup.findOne().sort({ order: -1 }).select('order');
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;

    const group = new TheaterGroup({
      name: body.name,
      ageRange: body.ageRange,
      description: body.description,
      schedule: body.schedule,
      location: body.location,
      price: body.price,
      memberPrice: body.memberPrice,
      color: body.color || '#844cfc',
      order: body.order ?? newOrder,
      active: body.active !== false,
    });

    await group.save();
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating theater group:', error);
    return NextResponse.json({ error: 'Failed to create theater group' }, { status: 500 });
  }
}
