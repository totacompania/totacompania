import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';

// Regles de renommage basées sur le nom original et le contenu
const analyzeAndRename = (originalName: string, mimeType: string): { newName: string; category: string; tags: string[] } => {
  const name = originalName.toLowerCase();
  let newName = originalName;
  let category = 'général';
  let tags: string[] = [];

  // Logos
  if (name.includes('logo') || name.includes('logocc') || name.includes('logo_')) {
    category = 'logos';
    tags.push('logo');

    if (name.includes('tnt')) {
      newName = 'logo-tnt.jpg';
      tags.push('partenaire', 'théâtre');
    } else if (name.includes('ccas')) {
      newName = 'logo-ccas-toul.jpg';
      tags.push('partenaire', 'social');
    } else if (name.includes('csc')) {
      newName = 'logo-csc-toul.jpg';
      tags.push('partenaire', 'social');
    } else if (name.includes('heron') || name.includes('héron')) {
      newName = 'logo-heron.png';
      tags.push('compagnie');
    } else if (name.includes('mosaique') || name.includes('mosaïque')) {
      newName = 'logo-mosaique.jpg';
      tags.push('partenaire');
    } else if (name.includes('territoire')) {
      newName = 'logo-territoire.gif';
      tags.push('partenaire', 'institutionnel');
    } else if (name.includes('tota')) {
      newName = 'logo-tota-compania.png';
      tags.push('compagnie', 'identite');
    } else if (name.includes('cc') || name.includes('logocc')) {
      newName = 'logo-centre-culturel.png';
      tags.push('lieu', 'vauban');
    }
  }

  // Ville de Toul
  else if (name.includes('toul') && (name.includes('cmjn') || name.includes('ville'))) {
    newName = 'logo-ville-de-toul.jpg';
    category = 'logos';
    tags = ['logo', 'partenaire', 'institutionnel', 'toul'];
  }

  // Partenaires
  else if (name.includes('partenaire')) {
    category = 'logos';
    tags.push('partenaires', 'compilation');
    newName = 'partenaires-compilation.png';
  }

  // Images de spectacles
  else if (name.includes('spectacle') || name.includes('scène') || name.includes('théâtre')) {
    category = 'spectacles';
    tags.push('spectacle', 'scène');
  }

  // Contes
  else if (name.includes('conte') || name.includes('contes-blancs')) {
    category = 'spectacles';
    tags.push('spectacle', 'conte');
    if (name.includes('blancs')) {
      newName = 'spectacle-contes-blancs.png';
      tags.push('contes-blancs');
    }
  }

  // Colorez-moi
  else if (name.includes('colorez')) {
    category = 'spectacles';
    tags.push('spectacle', 'colorez-moi');
    newName = name.endsWith('.pdf') ? 'dossier-colorez-moi.pdf' : 'spectacle-colorez-moi.png';
  }

  // MPDTR - Ma Petite Dose de Théâtre Rire
  else if (name.includes('mpdtr') || name.includes('mdp')) {
    category = 'événements';
    tags.push('mpdtr', 'théâtre-rire', 'événement');
    // Garder le lieu dans le nom si present
    if (name.includes('mandres')) {
      newName = 'mpdtr-mandres.jpg';
      tags.push('mandres');
    } else if (name.includes('pagney')) {
      newName = 'mpdtr-pagney.jpg';
      tags.push('pagney');
    } else if (name.includes('maennolsheim')) {
      newName = 'mpdtr-maennolsheim.jpg';
      tags.push('maennolsheim');
    }
  }

  // Programme/Saison
  else if (name.includes('saison') || name.includes('programme')) {
    category = 'documents';
    tags.push('programme', 'saison');
    const match = name.match(/(\d{2})-(\d{2})/);
    if (match) {
      tags.push(`saison-${match[1]}-${match[2]}`);
    }
    if (name.includes('page')) {
      const pageMatch = name.match(/page-(\d+)/);
      if (pageMatch) {
        newName = `programme-saison-page-${pageMatch[1]}.jpg`;
      }
    }
  }

  // Festival
  else if (name.includes('festival') || name.includes('tita') || name.includes('renc')) {
    category = 'événements';
    tags.push('festival');
    if (name.includes('tita') || name.includes('familia')) {
      newName = 'festival-tota-familia.png';
      tags.push('tota-familia');
    } else if (name.includes('renc')) {
      newName = 'festival-rencarts.png';
      tags.push('rencarts');
    }
  }

  // Ateliers
  else if (name.includes('atelier') || name.includes('stage')) {
    category = 'ateliers';
    tags.push('atelier', 'formation');
  }

  // Résidences
  else if (name.includes('residen') || name.includes('res-art')) {
    category = 'résidences';
    tags.push('résidence', 'artiste');
    newName = 'résidence-artistique.png';
  }

  // Centre Vauban
  else if (name.includes('vauban') || name.includes('vaub') || name.includes('cc-vaub')) {
    category = 'lieux';
    tags.push('vauban', 'lieu', 'centre-culturel');
    newName = 'centre-culturel-vauban.png';
  }

  // Photos generiques IMG_xxxx
  else if (name.match(/^img[_-]?\d+/i)) {
    category = 'photos';
    tags.push('photo', 'événement');
  }

  // Fiches tarifaires
  else if (name.includes('fichetarifaire') || name.includes('fiche') && name.includes('tarif')) {
    category = 'documents';
    tags.push('tarif', 'document', 'professionnel');
    // Extraire l'acronyme du spectacle
    const acronyms: Record<string, string> = {
      'xy': 'XY-et-moi',
      'vdt': 'vert-de-terre',
      'pv': 'piteur-vieux',
      'ns': 'ne-songez-pas',
      'cdm': 'colorez-moi'
    };
    for (const [key, spectacle] of Object.entries(acronyms)) {
      if (name.toLowerCase().includes(key)) {
        newName = `fiche-tarifaire-${spectacle}.pdf`;
        tags.push(spectacle);
        break;
      }
    }
  }

  // Dossiers artistiques
  else if (name.includes('dossier')) {
    category = 'documents';
    tags.push('dossier', 'artistique', 'professionnel');
  }

  // Articles de presse
  else if (name.includes('article') || name.includes('presse') || name.includes('journal')) {
    category = 'presse';
    tags.push('article', 'presse', 'media');
  }

  return { newName, category, tags };
};

// GET: Analyser toutes les images et retourner les suggestions de renommage
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const preview = searchParams.get('preview') === 'true';

    const media = await Media.find({ mimeType: { $regex: '^image/' } }).limit(500);

    const suggestions = media.map((item: any) => {
      const analysis = analyzeAndRename(item.originalName, item.mimeType);
      return {
        _id: item._id,
        currentName: item.originalName,
        suggestedName: analysis.newName,
        currentCategory: item.category,
        suggestedCategory: analysis.category,
        currentTags: item.tags || [],
        suggestedTags: analysis.tags,
        needsRename: item.originalName !== analysis.newName,
        needsCategoryUpdate: item.category !== analysis.category,
      };
    });

    const stats = {
      total: suggestions.length,
      needsRename: suggestions.filter(s => s.needsRename).length,
      needsCategoryUpdate: suggestions.filter(s => s.needsCategoryUpdate).length,
      byCategory: suggestions.reduce((acc: Record<string, number>, s) => {
        acc[s.suggestedCategory] = (acc[s.suggestedCategory] || 0) + 1;
        return acc;
      }, {}),
    };

    return NextResponse.json({
      stats,
      suggestions: preview ? suggestions.filter(s => s.needsRename || s.needsCategoryUpdate).slice(0, 50) : suggestions,
    });
  } catch (error) {
    console.error('Error analyzing media:', error);
    return NextResponse.json({ error: 'Failed to analyze media' }, { status: 500 });
  }
}

// POST: Appliquer les renommages
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { ids, applyAll } = await request.json();

    let query: any = { mimeType: { $regex: '^image/' } };
    if (!applyAll && ids && ids.length > 0) {
      query._id = { $in: ids };
    }

    const media = await Media.find(query);
    const results = [];

    for (const item of media) {
      const analysis = analyzeAndRename(item.originalName, item.mimeType);

      const allTags = [...(item.tags || []), ...analysis.tags];
      const uniqueTags = allTags.filter((tag, index) => allTags.indexOf(tag) === index);
      const updates: any = {
        category: analysis.category,
        tags: uniqueTags,
      };

      // Ne renommer que si different et pas deja un nom propre
      if (analysis.newName !== item.originalName && !item.originalName.startsWith('spectacle-') && !item.originalName.startsWith('logo-')) {
        updates.originalName = analysis.newName;
      }

      await Media.findByIdAndUpdate(item._id, updates);
      results.push({
        _id: item._id,
        oldName: item.originalName,
        newName: updates.originalName || item.originalName,
        category: updates.category,
        tags: updates.tags,
      });
    }

    return NextResponse.json({
      success: true,
      updated: results.length,
      results: results.slice(0, 20), // Limiter la reponse
    });
  } catch (error) {
    console.error('Error applying renames:', error);
    return NextResponse.json({ error: 'Failed to apply renames' }, { status: 500 });
  }
}
