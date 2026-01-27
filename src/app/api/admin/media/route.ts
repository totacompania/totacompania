import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configuration pour le proxy d'upload vers le NAS
const NAS_UPLOAD_URL = process.env.NAS_UPLOAD_URL || 'https://tota.boris-henne.fr/api/upload-proxy';
const UPLOAD_PROXY_TOKEN = process.env.UPLOAD_PROXY_TOKEN || 'tota-upload-secret-2024';

// Detecter si on est sur Vercel (production)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

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

    // Get unique folders and categories for filters
    const folders = await Media.distinct('folder');
    const categories = await Media.distinct('category');

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
        categories: categories.filter(Boolean),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// Upload vers le NAS via proxy (pour Vercel/Production)
async function uploadViaNasProxy(files: File[]): Promise<unknown[]> {
  const formData = new FormData();
  
  for (const file of files) {
    formData.append('files', file);
  }

  const response = await fetch(NAS_UPLOAD_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPLOAD_PROXY_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload to NAS');
  }

  return response.json();
}

// Upload local (pour le NAS/Dev)
async function uploadLocally(files: File[]): Promise<unknown[]> {
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

    results.push(media);
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    let results;

    if (isVercel) {
      // En production (Vercel), envoyer vers le NAS
      console.log('Production mode: uploading via NAS proxy');
      results = await uploadViaNasProxy(files);
    } else {
      // En dev (NAS), ecrire localement
      console.log('Dev mode: uploading locally');
      results = await uploadLocally(files);
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error('Error uploading media:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload media';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
