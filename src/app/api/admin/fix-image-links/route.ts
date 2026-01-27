import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media, Spectacle, Festival } from '@/models';

// Build a mapping from original filename to actual path
async function buildMediaMapping(): Promise<Map<string, string>> {
  const mapping = new Map<string, string>();
  const allMedia = await Media.find({});

  for (const media of allMedia) {
    // Map by original name
    mapping.set(media.originalName, media.path);
    // Also map by filename without extension variations
    const baseName = media.originalName.replace(/\.[^/.]+$/, '');
    mapping.set(baseName, media.path);
  }

  return mapping;
}

// Fix image path using the mapping
function fixImagePath(imagePath: string, mapping: Map<string, string>): string {
  if (!imagePath) return imagePath;

  // Extract filename from path
  const filename = imagePath.split('/').pop() || '';

  // Check if we have a mapping for this file
  if (mapping.has(filename)) {
    return mapping.get(filename)!;
  }

  // Try without the /uploads/ prefix
  const cleanPath = imagePath.replace(/^\/uploads\//, '');
  if (mapping.has(cleanPath)) {
    return mapping.get(cleanPath)!;
  }

  // Return original if no mapping found
  return imagePath;
}

export async function POST() {
  try {
    await connectDB();

    const mapping = await buildMediaMapping();
    const results = {
      spectacles: { updated: 0, details: [] as string[] },
      festivals: { updated: 0, details: [] as string[] },
      pages: { updated: 0, details: [] as string[] },
    };

    // Fix Spectacles
    const spectacles = await Spectacle.find({});
    for (const spec of spectacles) {
      let updated = false;
      const oldImage = spec.image;
      const newImage = fixImagePath(spec.image, mapping);

      if (newImage !== oldImage) {
        spec.image = newImage;
        updated = true;
        results.spectacles.details.push(`${spec.slug}: image ${oldImage} -> ${newImage}`);
      }

      // Fix gallery
      if (spec.gallery && spec.gallery.length > 0) {
        const newGallery = spec.gallery.map((img: string) => {
          const fixed = fixImagePath(img, mapping);
          if (fixed !== img) {
            results.spectacles.details.push(`${spec.slug}: gallery ${img} -> ${fixed}`);
            updated = true;
          }
          return fixed;
        });
        spec.gallery = newGallery;
      }

      if (updated) {
        await spec.save();
        results.spectacles.updated++;
      }
    }

    // Fix Festivals
    const festivals = await Festival.find({});
    for (const fest of festivals) {
      if (!fest.image) continue;
      const oldImage = fest.image;
      const newImage = fixImagePath(fest.image, mapping);

      if (newImage !== oldImage) {
        fest.image = newImage;
        results.festivals.details.push(`${fest.slug}: image ${oldImage} -> ${newImage}`);
        await fest.save();
        results.festivals.updated++;
      }
    }

    return NextResponse.json({
      success: true,
      mappingSize: mapping.size,
      results,
    });
  } catch (error) {
    console.error('Fix links error:', error);
    return NextResponse.json({ error: 'Fix failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const mapping = await buildMediaMapping();
    const issues: string[] = [];

    // Check Spectacles
    const spectacles = await Spectacle.find({});
    for (const spec of spectacles) {
      const newImage = fixImagePath(spec.image, mapping);
      if (newImage !== spec.image) {
        issues.push(`Spectacle "${spec.slug}": image "${spec.image}" -> "${newImage}"`);
      }

      if (spec.gallery) {
        for (const img of spec.gallery) {
          const fixed = fixImagePath(img, mapping);
          if (fixed !== img) {
            issues.push(`Spectacle "${spec.slug}": gallery "${img}" -> "${fixed}"`);
          }
        }
      }
    }

    // Check Festivals
    const festivals = await Festival.find({});
    for (const fest of festivals) {
      if (!fest.image) continue;
      const newImage = fixImagePath(fest.image, mapping);
      if (newImage !== fest.image) {
        issues.push(`Festival "${fest.slug}": image "${fest.image}" -> "${newImage}"`);
      }
    }

    return NextResponse.json({
      mappingSize: mapping.size,
      issuesFound: issues.length,
      issues,
    });
  } catch (error) {
    console.error('Check error:', error);
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}
