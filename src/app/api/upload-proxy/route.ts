import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Token secret pour securiser l'endpoint
const UPLOAD_PROXY_TOKEN = process.env.UPLOAD_PROXY_TOKEN || 'tota-upload-secret-2024';

export async function POST(request: NextRequest) {
  try {
    // Verifier le token d'authentification
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== UPLOAD_PROXY_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Creer le dossier avec la date (YYYY/MM)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateFolder = `${year}/${month}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads', dateFolder);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const results = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const baseName = sanitizedName.substring(0, sanitizedName.lastIndexOf('.')) || sanitizedName;
      const extension = file.name.split('.').pop();
      const filename = `${baseName}_${timestamp}.${extension}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);

      const relativePath = `/uploads/${dateFolder}/${filename}`;

      // Return file info only (no DB entry - the caller handles that)
      results.push({
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: relativePath,
        url: relativePath,
      });
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error('Error in upload proxy:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'upload-proxy' });
}
