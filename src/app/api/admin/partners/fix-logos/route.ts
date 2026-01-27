import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Partner, Media } from '@/models';

// Logo mappings: partner name patterns -> média filename patterns
const logoMappings: Record<string, string[]> = {
  'Ville de Toul': ['toul', 'ville-de-toul'],
  'Théâtre National de Nice': ['tnt', 'théâtre-national'],
  'Théâtre de la Manufacture': ['manufacture'],
  'Conseil Departemental': ['cd54', 'conseil-departemental', 'meurthe'],
  'Region Grand Est': ['region', 'grand-est'],
  'DRAC': ['drac', 'ministere'],
  'CAF': ['caf'],
  'CCAS': ['ccas'],
  'CSC': ['csc', 'centre-social'],
  'Mosaique': ['mosaique', 'mosaic'],
  'Heron': ['heron'],
  'Territoire': ['territoire'],
  'CC': ['cc-', 'communaute'],
};

// POST: Auto-assign logos to partners based on name matching
export async function POST() {
  try {
    await connectDB();

    const partners = await Partner.find({});
    const allMedia = await Media.find({
      mimeType: { $regex: /^image\// }
    });

    let updated = 0;
    let skipped = 0;
    const updates: Array<{ partner: string; logo: string }> = [];

    for (const partner of partners) {
      // Skip if already has valid mediaId
      if (partner.mediaId) {
        const existingMedia = await Media.findById(partner.mediaId);
        if (existingMedia) {
          skipped++;
          continue;
        }
      }

      // Find matching logo
      let foundLogo = null;
      const partnerNameLower = partner.name.toLowerCase();

      // Check direct mappings first
      for (const [pattern, keywords] of Object.entries(logoMappings)) {
        if (partnerNameLower.includes(pattern.toLowerCase())) {
          // Search for logo with matching keywords
          for (const keyword of keywords) {
            const matchingMedia = allMedia.find(m =>
              m.filename.toLowerCase().includes(keyword) ||
              m.path.toLowerCase().includes(keyword)
            );
            if (matchingMedia) {
              foundLogo = matchingMedia;
              break;
            }
          }
          if (foundLogo) break;
        }
      }

      // If no mapping match, try to find logo by partner name keywords
      if (!foundLogo) {
        const nameWords = partnerNameLower.split(/\s+/).filter(w => w.length > 3);
        for (const word of nameWords) {
          const matchingMedia = allMedia.find(m =>
            m.filename.toLowerCase().includes(word) ||
            m.path.toLowerCase().includes(word)
          );
          if (matchingMedia) {
            foundLogo = matchingMedia;
            break;
          }
        }
      }

      if (foundLogo) {
        await Partner.updateOne(
          { _id: partner._id },
          { $set: { mediaId: foundLogo._id.toString() } }
        );
        updated++;
        updates.push({ partner: partner.name, logo: foundLogo.filename });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Logos mis a jour: ${updated}, deja configures: ${skipped}`,
      updated,
      skipped,
      total: partners.length,
      updates
    });
  } catch (error) {
    console.error('Error fixing partner logos:', error);
    return NextResponse.json({ error: 'Failed to fix partner logos' }, { status: 500 });
  }
}

// GET: Check status of partner logos
export async function GET() {
  try {
    await connectDB();

    const partners = await Partner.find({});
    const results = [];

    for (const partner of partners) {
      let status = 'no-logo';
      let logoPath = null;

      if (partner.mediaId) {
        const media = await Media.findById(partner.mediaId);
        if (media) {
          status = 'valid';
          logoPath = media.path;
        } else {
          status = 'invalid-id';
        }
      }

      results.push({
        name: partner.name,
        status,
        mediaId: partner.mediaId || null,
        logoPath
      });
    }

    // Also list available logo images
    const logoImages = await Media.find({
      mimeType: { $regex: /^image\// },
      $or: [
        { path: { $regex: /logo/i } },
        { filename: { $regex: /logo/i } },
        { folder: { $regex: /logo/i } },
        { folder: { $regex: /partenaire/i } }
      ]
    });

    return NextResponse.json({
      partners: results,
      availableLogos: logoImages.map(m => ({
        id: m._id,
        filename: m.filename,
        path: m.path
      }))
    });
  } catch (error) {
    console.error('Error checking partner logos:', error);
    return NextResponse.json({ error: 'Failed to check partner logos' }, { status: 500 });
  }
}
