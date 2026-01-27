import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// MIME types mapping
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const filePath = pathSegments.join('/');
  const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);

  // Security: prevent path traversal
  const normalizedPath = path.normalize(fullPath);
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!normalizedPath.startsWith(uploadsDir)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  try {
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      return NextResponse.json({ error: 'Not a file' }, { status: 400 });
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(fullPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 });
  }
}
