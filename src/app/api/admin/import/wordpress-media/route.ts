import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';
import fs from 'fs';
import path from 'path';

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

async function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): Promise<string[]> {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    try {
      if (fs.statSync(fullPath).isDirectory()) {
        await getAllFiles(fullPath, arrayOfFiles);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (Object.keys(mimeTypes).includes(ext)) {
          arrayOfFiles.push(fullPath);
        }
      }
    } catch {
      // Skip files we can't access
    }
  }

  return arrayOfFiles;
}

// POST - Import WordPress media
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const wpUploadsPath = body.sourcePath || '/app/wordpress/wp-content/uploads';
    const targetPath = path.join(process.cwd(), 'public', 'uploads');

    // Check source exists
    if (!fs.existsSync(wpUploadsPath)) {
      return NextResponse.json({
        error: `Source path not found: ${wpUploadsPath}`,
        hint: 'Make sure the WordPress uploads folder is mounted in the container',
      }, { status: 400 });
    }

    // Ensure target exists
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // Get all files
    const files = await getAllFiles(wpUploadsPath);

    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const importedFiles: string[] = [];

    for (const filePath of files) {
      const filename = path.basename(filePath);

      try {
        // Skip WordPress thumbnails
        if (/-\d+x\d+\.[a-z]+$/i.test(filename)) {
          skipped++;
          continue;
        }

        // Check if already exists
        const existing = await Media.findOne({ originalName: filename });
        if (existing) {
          skipped++;
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const ext = path.extname(filename);
        const newFilename = `${timestamp}-${randomStr}${ext}`;
        const destPath = path.join(targetPath, newFilename);

        // Copy file
        fs.copyFileSync(filePath, destPath);

        // Get stats
        const stats = fs.statSync(destPath);

        // Get folder from relative path
        const relativePath = path.relative(wpUploadsPath, filePath);
        const folder = '/' + path.dirname(relativePath).replace(/\\/g, '/');

        // Create média entry
        const media = new Media({
          filename: newFilename,
          originalName: filename,
          mimeType: getMimeType(filename),
          size: stats.size,
          path: `/uploads/${newFilename}`,
          url: `/uploads/${newFilename}`,
          folder: folder === '/.' ? '/' : folder,
          category: 'wordpress-import',
          tags: ['import', 'wordpress'],
        });

        await media.save();
        imported++;
        importedFiles.push(filename);
      } catch (err) {
        console.error(`Error importing ${filename}:`, err);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: files.length,
        imported,
        skipped,
        errors,
      },
      importedFiles: importedFiles.slice(0, 20), // First 20 for display
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}

// GET - Check status and available files
export async function GET() {
  try {
    const wpUploadsPath = '/app/wordpress/wp-content/uploads';

    const status = {
      sourceExists: fs.existsSync(wpUploadsPath),
      sourcePath: wpUploadsPath,
      mediaCount: 0,
    };

    await connectDB();
    status.mediaCount = await Media.countDocuments({ category: 'wordpress-import' });

    if (status.sourceExists) {
      const files = await getAllFiles(wpUploadsPath);
      return NextResponse.json({
        ...status,
        filesFound: files.length,
      });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
