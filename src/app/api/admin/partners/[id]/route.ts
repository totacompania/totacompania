import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Partner } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const partner = await Partner.findById(id);

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json({ error: 'Failed to fetch partner' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const partner = await Partner.findByIdAndUpdate(
      id,
      {
        name: body.name,
        logo: body.logo,
        mediaId: body.mediaId,
        website: body.website,
        description: body.description,
        category: body.category,
        order: body.order,
        active: body.active,
      },
      { new: true }
    );

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const partner = await Partner.findByIdAndDelete(id);

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
