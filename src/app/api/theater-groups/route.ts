import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TheaterGroup } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const groups = await TheaterGroup.find({ active: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching theater groups:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const group = await TheaterGroup.create(data);
    return NextResponse.json(group);
  } catch (error) {
    console.error('Error creating theater group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;
    await TheaterGroup.findByIdAndUpdate(_id, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating theater group:', error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
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
    await TheaterGroup.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting theater group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}
