import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Article } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const result = await Article.find().sort({ createdAt: -1 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const article = new Article({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      published: body.published || false,
      publishedAt: body.published ? new Date() : undefined,
    });
    await article.save();
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
