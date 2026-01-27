import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models';

// GET: Get single subscriber
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const subscriber = await NewsletterSubscriber.findById(params.id);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Abonne non trouve' },
        { status: 404 }
      );
    }

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error('Error fetching subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriber' },
      { status: 500 }
    );
  }
}

// PUT: Update subscriber
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const subscriber = await NewsletterSubscriber.findById(params.id);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Abonne non trouve' },
        { status: 404 }
      );
    }

    // Update fields
    if (body.firstName !== undefined) subscriber.firstName = body.firstName;
    if (body.lastName !== undefined) subscriber.lastName = body.lastName;
    if (body.status !== undefined) {
      subscriber.status = body.status;
      if (body.status === 'unsubscribed' && !subscriber.unsubscribedAt) {
        subscriber.unsubscribedAt = new Date();
      }
      if (body.status === 'active') {
        subscriber.unsubscribedAt = undefined;
      }
    }
    if (body.tags !== undefined) subscriber.tags = body.tags;

    await subscriber.save();

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

// DELETE: Delete subscriber
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(params.id);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Abonne non trouve' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Abonne supprime',
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
