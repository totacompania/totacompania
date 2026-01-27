import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Message } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      );
    }

    const message = new Message({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject || 'Contact depuis le site',
      message: body.message,
      read: false,
      archived: false,
    });

    await message.save();

    return NextResponse.json({ success: true, id: message._id }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
