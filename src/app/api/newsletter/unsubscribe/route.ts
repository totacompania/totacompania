import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models';

// POST: Unsubscribe from newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { token, email } = body;

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Token ou email requis' },
        { status: 400 }
      );
    }

    let subscriber;

    if (token) {
      subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });
    } else {
      subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    }

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Abonne non trouve' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'Vous etes deja desinscrit de la newsletter'
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Vous avez ete desinscrit de la newsletter avec succes'
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la desinscription' },
      { status: 500 }
    );
  }
}

// GET: Unsubscribe via link (token in query)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token requis' },
        { status: 400 }
      );
    }

    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Lien de desinscription invalide' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'Vous etes deja desinscrit de la newsletter',
        email: subscriber.email
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Vous avez ete desinscrit de la newsletter avec succes',
      email: subscriber.email
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la desinscription' },
      { status: 500 }
    );
  }
}
