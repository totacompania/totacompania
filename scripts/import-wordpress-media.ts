/**
 * Script d'import des medias WordPress
 *
 * Usage: npx ts-node scripts/import-wordpress-media.ts
 *
 * Ce script:
 * 1. Scanne le dossier wp-content/uploads du site WordPress
 * 2. Copie les fichiers vers public/uploads
 * 3. Cree les entrees dans MongoDB
 *
 * Note: Ce script doit etre execute dans un environnement avec acces
 * au dossier WordPress (par exemple dans le container Docker sur le NAS)
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Configuration
const WORDPRESS_UPLOADS_PATH = process.env.WP_UPLOADS_PATH || '/app/wordpress/wp-content/uploads';
const TARGET_UPLOADS_PATH = process.env.TARGET_PATH || '/app/public/uploads';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/totacompania';

// Media Schema (simplified for script)
const MediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  category: { type: String, default: 'wordpress-import' },
  tags: { type: [String], default: [] },
  folder: { type: String, default: '/' },
  width: Number,
  height: Number,
  usedIn: { type: [{ model: String, id: String, field: String }], default: [] },
}, { timestamps: true });

const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);

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
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Only include media files
      const ext = path.extname(file).toLowerCase();
      if (Object.keys(mimeTypes).includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  }

  return arrayOfFiles;
}

async function importMedia() {
  console.log('='.repeat(50));
  console.log('Import des medias WordPress');
  console.log('='.repeat(50));
  console.log(`Source: ${WORDPRESS_UPLOADS_PATH}`);
  console.log(`Destination: ${TARGET_UPLOADS_PATH}`);
  console.log(`MongoDB: ${MONGODB_URI}`);
  console.log('');

  // Check if source exists
  if (!fs.existsSync(WORDPRESS_UPLOADS_PATH)) {
    console.error(`ERREUR: Le dossier source n'existe pas: ${WORDPRESS_UPLOADS_PATH}`);
    process.exit(1);
  }

  // Create target directory if needed
  if (!fs.existsSync(TARGET_UPLOADS_PATH)) {
    fs.mkdirSync(TARGET_UPLOADS_PATH, { recursive: true });
    console.log('Dossier de destination cree');
  }

  // Connect to MongoDB
  console.log('Connexion a MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connecte!');

  // Get all media files
  console.log('Scan des fichiers...');
  const files = await getAllFiles(WORDPRESS_UPLOADS_PATH);
  console.log(`${files.length} fichiers trouves`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const relativePath = path.relative(WORDPRESS_UPLOADS_PATH, filePath);
    const filename = path.basename(filePath);

    try {
      // Skip WordPress thumbnails (files ending with -NNNxNNN.ext)
      if (/-\d+x\d+\.[a-z]+$/i.test(filename)) {
        skipped++;
        continue;
      }

      // Check if already exists in DB
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
      const targetPath = path.join(TARGET_UPLOADS_PATH, newFilename);

      // Copy file
      fs.copyFileSync(filePath, targetPath);

      // Get file stats
      const stats = fs.statSync(targetPath);

      // Create folder from relative path
      const folder = '/' + path.dirname(relativePath).replace(/\\/g, '/');

      // Create media entry
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

      // Progress
      if (i % 50 === 0) {
        console.log(`Progression: ${i}/${files.length} (${Math.round(i/files.length*100)}%)`);
      }
    } catch (err) {
      console.error(`Erreur sur ${filename}:`, err);
      errors++;
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Import termine!');
  console.log(`Importes: ${imported}`);
  console.log(`Ignores (doublons/miniatures): ${skipped}`);
  console.log(`Erreurs: ${errors}`);
  console.log('='.repeat(50));

  await mongoose.disconnect();
}

// Run
importMedia().catch(console.error);
