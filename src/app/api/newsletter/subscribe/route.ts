import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models';

// POST: Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { email, firstName, lastName } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'Cette adresse email est deja inscrite a la newsletter' },
          { status: 400 }
        );
      }
      // Reactivate if previously unsubscribed
      existing.status = 'active';
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      if (firstName) existing.firstName = firstName;
      if (lastName) existing.lastName = lastName;
      await existing.save();

      return NextResponse.json({
        success: true,
        message: 'Votre inscription a la newsletter a ete reactivee'
      });
    }

    // Create new subscriber
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      firstName,
      lastName,
      unsubscribeToken,
      source: 'website',
    });

    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Merci pour votre inscription a la newsletter!'
    }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
