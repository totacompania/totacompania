import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const folder = searchParams.get('folder') || '';
    const category = searchParams.get('category') || '';
    const mimeType = searchParams.get('mimeType') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { alt: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (folder) {
      query.folder = folder;
    }

    if (category) {
      query.category = category;
    }

    if (mimeType) {
      if (mimeType === 'image') {
        query.mimeType = { $regex: '^image/' };
      } else if (mimeType === 'video') {
        query.mimeType = { $regex: '^video/' };
      } else if (mimeType === 'audio') {
        query.mimeType = { $regex: '^audio/' };
      } else {
        query.mimeType = { $regex: mimeType };
      }
    }

    // Get total count
    const total = await Media.countDocuments(query);

    // Get paginated results
    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'asc' ? 1 : -1 };

    const result = await Media.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    // Get unique folders and catégories for filters
    const folders = await Media.distinct('folder');
    const catégories = await Media.distinct('category');

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        folders: folders.filter(Boolean),
        catégories: catégories.filter(Boolean),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const results = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomStr}.${extension}`;
      const filepath = join(uploadDir, filename);

      // Write file
      await writeFile(filepath, buffer);

      // Save to database
      const media = new Media({
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: `/uploads/${filename}`,
        url: `/uploads/${filename}`,
        folder: '/',
        category: 'général',
      });
      await media.save();

      results.push(media);
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}
