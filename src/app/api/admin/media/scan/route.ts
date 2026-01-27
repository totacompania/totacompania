import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';

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

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function getAllFiles(dirPath: string, basePath: string, arrayOfFiles: { fullPath: string; relativePath: string }[] = []): { fullPath: string; relativePath: string }[] {
  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const relativePath = path.relative(basePath, fullPath);

      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          getAllFiles(fullPath, basePath, arrayOfFiles);
        } else {
          const ext = path.extname(file).toLowerCase();
          if (Object.keys(mimeTypes).includes(ext)) {
            arrayOfFiles.push({ fullPath, relativePath });
          }
        }
      } catch (e) {
        // Skip files we cannot access
      }
    }
  } catch (e) {
    // Skip directories we cannot access
  }

  return arrayOfFiles;
}

// GET: Preview scan without importing
export async function GET() {
  try {
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsPath)) {
      return NextResponse.json({ error: 'Uploads folder not found', path: uploadsPath }, { status: 404 });
    }

    const files = getAllFiles(uploadsPath, uploadsPath);

    // Filter out thumbnails
    const filteredFiles = files.filter(f => !/-\d+x\d+\.[a-z]+$/i.test(f.relativePath));

    return NextResponse.json({
      uploadsPath,
      totalFiles: files.length,
      filteredFiles: filteredFiles.length,
      thumbnailsSkipped: files.length - filteredFiles.length,
      preview: filteredFiles.slice(0, 20).map(f => f.relativePath)
    });
  } catch (error) {
    console.error('Error scanning media:', error);
    return NextResponse.json({ error: 'Failed to scan media' }, { status: 500 });
  }
}

// POST: Scan and import all files
export async function POST() {
  try {
    await connectDB();

    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsPath)) {
      return NextResponse.json({ error: 'Uploads folder not found' }, { status: 404 });
    }

    const files = getAllFiles(uploadsPath, uploadsPath);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const { fullPath, relativePath } of files) {
      try {
        const filename = path.basename(relativePath);

        // Skip WordPress thumbnails
        if (/-\d+x\d+\.[a-z]+$/i.test(filename)) {
          skipped++;
          continue;
        }

        // Check if already exists
        const urlPath = `/uploads/${relativePath.replace(/\\/g, '/')}`;
        const existing = await Media.findOne({
          $or: [
            { path: urlPath },
            { url: urlPath },
            { filename: filename }
          ]
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Get file stats
        const stats = fs.statSync(fullPath);

        // Determine folder
        const folder = '/' + path.dirname(relativePath).replace(/\\/g, '/');

        // Create média entry
        const media = new Media({
          filename: filename,
          originalName: filename,
          mimeType: getMimeType(filename),
          size: stats.size,
          path: urlPath,
          url: urlPath,
          folder: folder === '/.' ? '/' : folder,
          category: 'général',
          tags: ['import'],
        });

        await media.save();
        imported++;
      } catch (err) {
        console.error(`Error importing ${relativePath}:`, err);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors,
      total: files.length
    });
  } catch (error) {
    console.error('Error scanning media:', error);
    return NextResponse.json({ error: 'Failed to scan media' }, { status: 500 });
  }
}
