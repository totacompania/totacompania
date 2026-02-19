export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Intervention } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const interventions = await Intervention.find({ active: true })
      .sort({ order: 1, title: 1 })
      .lean();
    return NextResponse.json(interventions);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    return NextResponse.json({ error: 'Failed to fetch interventions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const intervention = await Intervention.create(data);
    return NextResponse.json(intervention);
  } catch (error) {
    console.error('Error creating intervention:', error);
    return NextResponse.json({ error: 'Failed to create intervention' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;
    await Intervention.findByIdAndUpdate(_id, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating intervention:', error);
    return NextResponse.json({ error: 'Failed to update intervention' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await Intervention.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting intervention:', error);
    return NextResponse.json({ error: 'Failed to delete intervention' }, { status: 500 });
  }
}
