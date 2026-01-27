import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle, Page, Festival } from '@/models';
import fs from 'fs';
import path from 'path';

// Simple HTML content extractor
function extractTextContent(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove HTML tags but keep content
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#8217;/g, "'");
  text = text.replace(/&#8211;/g, '-');
  text = text.replace(/&#8230;/g, '...');

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

// Extract title from HTML
function extractTitle(html: string): string {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  if (match) {
    return match[1].replace(/\s*[–-]\s*Tota Compania$/i, '').trim();
  }
  return '';
}

// Extract main content from Elementor
function extractElementorContent(html: string): string {
  // Try to find main content area
  const contentMatch = html.match(/<div[^>]*class="[^"]*elementor-widget-container[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
  if (contentMatch) {
    return contentMatch
      .map((div) => extractTextContent(div))
      .filter((text) => text.length > 50) // Only substantial content
      .join('\n\n');
  }
  return extractTextContent(html);
}

// Extract images from HTML
function extractImages(html: string): string[] {
  const images: string[] = [];
  const regex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    // Only include local images
    if (src.includes('/wp-content/uploads/')) {
      // Get just the filename
      const filename = path.basename(src.split('?')[0]);
      if (!/-\d+x\d+\.[a-z]+$/i.test(filename)) {
        // Skip thumbnails
        images.push(filename);
      }
    }
  }

  return Array.from(new Set(images)); // Remove duplicates
}

// Spectacle data structure from WordPress pages
const SPECTACLES_MAPPING = [
  {
    slug: 'vert-de-terre',
    folder: 'vert-de-terre',
    category: 'conte' as const,
    ageRange: 'Des 4 ans',
    duration: '50 min',
  },
  {
    slug: 'colorez-moi',
    folder: 'colorez-moi',
    category: 'conte' as const,
    ageRange: 'Des 3 ans',
    duration: '40 min',
  },
  {
    slug: 'contes-du-plexiglas',
    folder: 'contes-du-plexiglas',
    category: 'conte' as const,
    ageRange: 'Tout public',
    duration: '55 min',
  },
  {
    slug: 'les-contes-blancs',
    folder: 'les-contes-blancs',
    category: 'conte' as const,
    ageRange: 'Des 5 ans',
    duration: '50 min',
  },
  {
    slug: 'ne-songez-qua-maimer',
    folder: 'ne-songez-qua-maimer',
    category: 'théâtre' as const,
    ageRange: 'Adultes',
    duration: '1h15',
  },
  {
    slug: 'piteur-vieux',
    folder: 'piteur-vieux',
    category: 'théâtre' as const,
    ageRange: 'Des 10 ans',
    duration: '1h',
  },
];

const FESTIVALS_MAPPING = [
  {
    slug: 'festival-rencarts',
    folder: 'festival-rencarts',
  },
  {
    slug: 'festival-tota-familia',
    folder: 'festival-tota-familia',
  },
];

const PAGES_MAPPING = [
  { slug: 'presentation', folder: 'presentation' },
  { slug: 'centre-culturel-vauban', folder: 'centre-culturel-vauban' },
  { slug: 'résidences-artistiques', folder: 'résidences-artistiques' },
  { slug: 'tota-compania-lécole', folder: 'tota-compania-lécole' },
  { slug: 'stages-enfants-ados', folder: 'stages-enfants-ados' },
  { slug: 'ateliers-citoyens', folder: 'ateliers-citoyens' },
  { slug: 'ateliers-scolaires-et-entreprises', folder: 'ateliers-scolaires-et-entreprises' },
  { slug: 'formation-professionnelle', folder: 'formation-professionnelle' },
  { slug: 'partenaires', folder: 'partenaires' },
];

// POST - Import WordPress content
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const wpBasePath = body.sourcePath || '/app/wordpress';

    if (!fs.existsSync(wpBasePath)) {
      return NextResponse.json({
        error: `WordPress path not found: ${wpBasePath}`,
      }, { status: 400 });
    }

    const results = {
      spectacles: { imported: 0, skipped: 0, errors: 0 },
      festivals: { imported: 0, skipped: 0, errors: 0 },
      pages: { imported: 0, skipped: 0, errors: 0 },
    };

    // Import Spectacles
    for (const spec of SPECTACLES_MAPPING) {
      const indexPath = path.join(wpBasePath, spec.folder, 'index.html');

      if (!fs.existsSync(indexPath)) {
        results.spectacles.skipped++;
        continue;
      }

      try {
        // Check if already exists
        const existing = await Spectacle.findOne({ slug: spec.slug });
        if (existing) {
          results.spectacles.skipped++;
          continue;
        }

        const html = fs.readFileSync(indexPath, 'utf-8');
        const title = extractTitle(html);
        const content = extractElementorContent(html);
        const images = extractImages(html);

        // Get first paragraph as description
        const paragraphs = content.split('\n\n').filter((p) => p.length > 20);
        const description = paragraphs[0] || 'Description à venir';
        const longDescription = paragraphs.slice(1).join('\n\n');

        const spectacle = new Spectacle({
          slug: spec.slug,
          title: title || spec.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          subtitle: '',
          ageRange: spec.ageRange,
          duration: spec.duration,
          description: description.substring(0, 500),
          longDescription,
          image: images[0] ? `/uploads/${images[0]}` : '/images/spectacles/default.jpg',
          gallery: images.slice(1).map((img) => `/uploads/${img}`),
          category: spec.category,
          available: true,
          order: 0,
        });

        await spectacle.save();
        results.spectacles.imported++;
      } catch (err) {
        console.error(`Error importing spectacle ${spec.slug}:`, err);
        results.spectacles.errors++;
      }
    }

    // Import Festivals
    for (const fest of FESTIVALS_MAPPING) {
      const indexPath = path.join(wpBasePath, fest.folder, 'index.html');

      if (!fs.existsSync(indexPath)) {
        results.festivals.skipped++;
        continue;
      }

      try {
        const existing = await Festival.findOne({ slug: fest.slug });
        if (existing) {
          results.festivals.skipped++;
          continue;
        }

        const html = fs.readFileSync(indexPath, 'utf-8');
        const title = extractTitle(html);
        const content = extractElementorContent(html);
        const images = extractImages(html);

        const paragraphs = content.split('\n\n').filter((p) => p.length > 20);

        const festival = new Festival({
          slug: fest.slug,
          name: title || fest.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          description: paragraphs[0] || 'Description à venir',
          longDescription: paragraphs.slice(1).join('\n\n'),
          image: images[0] ? `/uploads/${images[0]}` : undefined,
          active: true,
        });

        await festival.save();
        results.festivals.imported++;
      } catch (err) {
        console.error(`Error importing festival ${fest.slug}:`, err);
        results.festivals.errors++;
      }
    }

    // Import Pages
    for (const pg of PAGES_MAPPING) {
      const indexPath = path.join(wpBasePath, pg.folder, 'index.html');

      if (!fs.existsSync(indexPath)) {
        results.pages.skipped++;
        continue;
      }

      try {
        const existing = await Page.findOne({ slug: pg.slug });
        if (existing) {
          results.pages.skipped++;
          continue;
        }

        const html = fs.readFileSync(indexPath, 'utf-8');
        const title = extractTitle(html);
        const content = extractElementorContent(html);

        const page = new Page({
          slug: pg.slug,
          title: title || pg.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          content: content || 'Contenu à venir',
          published: true,
        });

        await page.save();
        results.pages.imported++;
      } catch (err) {
        console.error(`Error importing page ${pg.slug}:`, err);
        results.pages.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Content import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}

// GET - List available WordPress content
export async function GET() {
  try {
    const wpBasePath = '/app/wordpress';

    const available = {
      spectacles: SPECTACLES_MAPPING.map((s) => ({
        ...s,
        exists: fs.existsSync(path.join(wpBasePath, s.folder, 'index.html')),
      })),
      festivals: FESTIVALS_MAPPING.map((f) => ({
        ...f,
        exists: fs.existsSync(path.join(wpBasePath, f.folder, 'index.html')),
      })),
      pages: PAGES_MAPPING.map((p) => ({
        ...p,
        exists: fs.existsSync(path.join(wpBasePath, p.folder, 'index.html')),
      })),
    };

    await connectDB();

    const counts = {
      spectacles: await Spectacle.countDocuments(),
      festivals: await Festival.countDocuments(),
      pages: await Page.countDocuments(),
    };

    return NextResponse.json({
      wpBasePath,
      exists: fs.existsSync(wpBasePath),
      available,
      currentCounts: counts,
    });
  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
