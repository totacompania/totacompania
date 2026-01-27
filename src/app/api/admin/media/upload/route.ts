import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const folder = '/' + year + '/' + month;

    const uploadDir = join(process.cwd(), 'public', 'uploads', year.toString(), month);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const originalName = file.name;
    const ext = originalName.split('.').pop() || '';
    const safeName = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 50);
    const filename = safeName + '_' + timestamp + '.' + ext;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    await connectDB();
    const path = '/uploads/' + year + '/' + month + '/' + filename;
    
    const media = await Media.create({
      filename,
      originalName,
      mimeType: file.type,
      size: file.size,
      path,
      url: path,
      alt: '',
      caption: '',
      category: 'general',
      tags: ['upload'],
      folder,
      usedIn: [],
      showInGallery: false,
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
