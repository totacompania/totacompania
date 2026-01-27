import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models';

// GET: List all subscribers
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await NewsletterSubscriber.countDocuments(query);
    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Stats
    const stats = {
      total: await NewsletterSubscriber.countDocuments(),
      active: await NewsletterSubscriber.countDocuments({ status: 'active' }),
      unsubscribed: await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' }),
      bounced: await NewsletterSubscriber.countDocuments({ status: 'bounced' }),
    };

    return NextResponse.json({
      subscribers,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST: Add new subscriber (admin)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { email, firstName, lastName, tags } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      return NextResponse.json(
        { error: 'Cette adresse email existe deja' },
        { status: 400 }
      );
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      firstName,
      lastName,
      unsubscribeToken,
      source: 'admin',
      tags: tags || [],
    });

    await subscriber.save();

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to create subscriber' },
      { status: 500 }
    );
  }
}

// DELETE: Delete multiple subscribers
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'IDs requis' },
        { status: 400 }
      );
    }

    const result = await NewsletterSubscriber.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscribers' },
      { status: 500 }
    );
  }
}
