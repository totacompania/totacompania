import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Token secret pour securiser l'endpoint (a configurer dans les variables d'environnement)
const UPLOAD_PROXY_TOKEN = process.env.UPLOAD_PROXY_TOKEN || 'tota-upload-secret-2024';

export async function POST(request: NextRequest) {
  try {
    // Verifier le token d'authentification
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== UPLOAD_PROXY_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
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

    // Creer le dossier s'il n'existe pas
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const results = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generer un nom de fichier unique
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const baseName = sanitizedName.substring(0, sanitizedName.lastIndexOf('.')) || sanitizedName;
      const extension = file.name.split('.').pop();
      const filename = `${baseName}_${timestamp}.${extension}`;
      const filepath = join(uploadDir, filename);

      // Ecrire le fichier
      await writeFile(filepath, buffer);

      // Chemin relatif pour la base de donnees
      const relativePath = `/uploads/${dateFolder}/${filename}`;

      // Sauvegarder en base de donnees
      const media = new Media({
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: relativePath,
        url: relativePath,
        folder: '/',
        category: 'general',
      });
      await media.save();

      results.push({
        _id: media._id,
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
