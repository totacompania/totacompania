import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Partner } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: Record<string, unknown> = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await Partner.countDocuments(query);
    const partners = await Partner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      data: partners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const partner = new Partner({
      name: body.name,
      logo: body.logo,
      mediaId: body.mediaId,
      website: body.website,
      description: body.description,
      category: body.category || 'institutionnel',
      order: body.order || 0,
      active: body.active !== false,
    });

    await partner.save();
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}
