// Script to retag all media items with proper categories
// Run with: npx ts-node scripts/retag-media.ts

const mediaUpdates: Record<string, { tags: string[], alt?: string, category?: string }> = {
  // === DESIGN ELEMENTS ===
  '694e85381c31bb10de86909a': { tags: ['design', 'header', 'branding'], alt: 'Header Tota Compania', category: 'design' },
  '694e85381c31bb10de86905e': { tags: ['design', 'titre', 'branding'], alt: 'Titre Partenaires', category: 'design' },
  '694e85381c31bb10de869052': { tags: ['design', 'titre', 'branding'], alt: 'Titre La Compagnie', category: 'design' },
  '694e85381c31bb10de869043': { tags: ['design', 'logo', 'branding'], alt: 'Logo Tota Compania', category: 'design' },
  '694e85381c31bb10de869049': { tags: ['design', 'presentation'], alt: 'Frontpage presentation', category: 'design' },
  '694e85381c31bb10de869040': { tags: ['design', 'contact'], alt: 'Contact design', category: 'design' },

  // === PARTENAIRES LOGOS ===
  '694e85381c31bb10de869007': { tags: ['logo', 'partenaire', 'institutionnel'], alt: 'Logo Meurthe et Moselle', category: 'logo-partenaire' },
  '694e85381c31bb10de86900d': { tags: ['logo', 'partenaire', 'institutionnel'], alt: 'Logo Ministere de l\'Education', category: 'logo-partenaire' },
  '694e85381c31bb10de869004': { tags: ['logo', 'partenaire'], alt: 'Logo Zieut Edition', category: 'logo-partenaire' },
  '694e85381c31bb10de869034': { tags: ['logo', 'partenaire', 'institutionnel'], alt: 'Logo Ville de Toul', category: 'logo-partenaire' },
  '694e85381c31bb10de869031': { tags: ['logo', 'partenaire'], alt: 'Logo Empreinte(s) la marque jeunes', category: 'logo-partenaire' },
  '694e85381c31bb10de86902e': { tags: ['logo', 'partenaire', 'association'], alt: 'Logo Association Mosaique', category: 'logo-partenaire' },
  '694e85381c31bb10de86902b': { tags: ['logo', 'partenaire', 'association'], alt: 'Logo Association du Heron', category: 'logo-partenaire' },
  '694e85381c31bb10de869028': { tags: ['logo', 'partenaire'], alt: 'Logo Centre Socio Culturel Toul', category: 'logo-partenaire' },
  '694e85381c31bb10de869046': { tags: ['logo', 'partenaire', 'media'], alt: 'Logo Radio Declic', category: 'logo-partenaire' },
  '694e85381c31bb10de86904c': { tags: ['logo', 'partenaire', 'institutionnel'], alt: 'Logo DILCRAH', category: 'logo-partenaire' },
  '694e85381c31bb10de86904f': { tags: ['logo', 'partenaire', 'institutionnel'], alt: 'Logo Ministere de la Culture', category: 'logo-partenaire' },
  '694e85381c31bb10de86905b': { tags: ['logo', 'partenaire'], alt: 'Logo TNT Dynamique', category: 'logo-partenaire' },
  '694e85381c31bb10de869055': { tags: ['logo', 'partenaire', 'institutionnel'], alt: 'Logo CCAS Centre Communal Action Sociale', category: 'logo-partenaire' },
  '694e85381c31bb10de869058': { tags: ['logo', 'partenaire', 'institutionnel'], alt: 'Logo Terres Touloises Communaute de Communes', category: 'logo-partenaire' },

  // === SPECTACLES - Vert de Terre ===
  '694e85381c31bb10de869115': { tags: ['spectacle', 'vert-de-terre', 'photo'], alt: 'Vert de Terre - Scene', category: 'spectacle' },
  '694e85381c31bb10de869064': { tags: ['spectacle', 'vert-de-terre', 'photo'], alt: 'Vert de Terre', category: 'spectacle' },
  '694e85381c31bb10de869061': { tags: ['spectacle', 'vert-de-terre', 'photo'], alt: 'Vert de Terre', category: 'spectacle' },
  '694e85381c31bb10de8690f1': { tags: ['document', 'dossier', 'vert-de-terre'], alt: 'Dossier Vert de Terre', category: 'document' },
  '694e85381c31bb10de8690f4': { tags: ['document', 'fiche-technique', 'vert-de-terre'], alt: 'Fiche Technique Vert de Terre', category: 'document' },

  // === SPECTACLES - Ne Songez ===
  '694e85381c31bb10de8690c1': { tags: ['document', 'fiche-technique', 'ne-songez'], alt: 'Fiche Technique Ne Songez', category: 'document' },
  '694e85391c31bb10de8691d3': { tags: ['document', 'dossier', 'ne-songez'], alt: 'Dossier Ne Songez 2025', category: 'document' },

  // === SPECTACLES - Contes du Monde ===
  '694e85381c31bb10de8690ee': { tags: ['document', 'dossier', 'contes-du-monde'], alt: 'Dossier Contes du Monde', category: 'document' },

  // === SPECTACLES - Colorez Moi ===
  '694e85391c31bb10de8691df': { tags: ['document', 'dossier', 'colorez-moi'], alt: 'Dossier Colorez Moi 2025', category: 'document' },
  '694e85391c31bb10de8691d9': { tags: ['spectacle', 'colorez-moi', 'affiche'], alt: 'Colorez Moi BD', category: 'spectacle' },

  // === SPECTACLES - Contes Blancs ===
  '694e85391c31bb10de8691ee': { tags: ['spectacle', 'contes-blancs', 'affiche'], alt: 'Contes Blancs', category: 'spectacle' },
  '694e85391c31bb10de8691e2': { tags: ['document', 'dossier', 'contes-blancs'], alt: 'Dossier Contes Blancs 2025', category: 'document' },

  // === SPECTACLES - XY ===
  '694e85391c31bb10de8691d6': { tags: ['document', 'dossier', 'xy'], alt: 'Dossier XY 2025', category: 'document' },
  '694e85381c31bb10de8691af': { tags: ['document', 'fiche-tarifaire', 'xy'], alt: 'Fiche Tarifaire XY', category: 'document' },

  // === SPECTACLES - Piteur Vieux ===
  '694e85381c31bb10de869118': { tags: ['document', 'dossier', 'piteur-vieux'], alt: 'Dossier Piteur Vieux', category: 'document' },
  '694e85381c31bb10de8691a9': { tags: ['document', 'fiche-tarifaire', 'piteur-vieux'], alt: 'Fiche Tarifaire Piteur Vieux', category: 'document' },

  // === SPECTACLES - MPDTR (Mot de Passe de Trop) ===
  '694e85381c31bb10de86915d': { tags: ['spectacle', 'mpdtr', 'affiche'], alt: 'MPDTR Affiche', category: 'spectacle' },
  '694e85381c31bb10de8690ca': { tags: ['spectacle', 'mpdtr', 'photo'], alt: 'MPDTR Photo', category: 'spectacle' },
  '694e85381c31bb10de8690c7': { tags: ['spectacle', 'mpdtr', 'article'], alt: 'Article MPDTR', category: 'spectacle' },
  '694e85381c31bb10de86919d': { tags: ['spectacle', 'mpdtr', 'photo'], alt: 'MPDTR Mandres', category: 'spectacle' },
  '694e85381c31bb10de86919a': { tags: ['spectacle', 'mpdtr', 'photo'], alt: 'MPDTR Pagney', category: 'spectacle' },
  '694e85381c31bb10de869197': { tags: ['spectacle', 'mpdtr', 'photo'], alt: 'MPDTR Mandres', category: 'spectacle' },
  '694e85381c31bb10de869194': { tags: ['spectacle', 'mpdtr', 'photo'], alt: 'MPDTR Maennolsheim', category: 'spectacle' },

  // === GALERIE / PHOTOS GENERALES ===
  '694e85381c31bb10de869094': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869091': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de86908e': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de86908b': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869088': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869085': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869082': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de86907f': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de86907c': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869079': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869076': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869073': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869070': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de86906d': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de86906a': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de869067': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },
  '694e85381c31bb10de86909d': { tags: ['galerie', 'spectacle', 'scene'], alt: 'Photo spectacle', category: 'galerie' },

  // === PHOTOS EQUIPE / ARTISTES ===
  '694e85381c31bb10de8690bb': { tags: ['equipe', 'artiste', 'portrait'], alt: 'Portrait artiste', category: 'equipe' },
  '694e85381c31bb10de8690b8': { tags: ['equipe', 'artiste', 'portrait'], alt: 'Portrait artiste', category: 'equipe' },
  '694e85381c31bb10de8690b5': { tags: ['equipe', 'artiste', 'portrait'], alt: 'Portrait artiste', category: 'equipe' },
  '694e85381c31bb10de8690b2': { tags: ['equipe', 'artiste', 'portrait'], alt: 'Portrait artiste', category: 'equipe' },
  '694e85381c31bb10de8690af': { tags: ['equipe', 'artiste', 'portrait'], alt: 'Portrait artiste', category: 'equipe' },

  // === ATELIERS ===
  '694e85381c31bb10de869182': { tags: ['design', 'ateliers', 'navigation'], alt: 'Ateliers design', category: 'design' },
  '694e85381c31bb10de86903d': { tags: ['atelier', 'formation', 'photo'], alt: 'Ateliers formation', category: 'atelier' },
  '694e85381c31bb10de86903a': { tags: ['atelier', 'citoyen', 'photo'], alt: 'Ateliers citoyens', category: 'atelier' },
  '694e85381c31bb10de869163': { tags: ['design', 'stages', 'navigation'], alt: 'Stages design', category: 'design' },

  // === CENTRE VAUBAN ===
  '694e85381c31bb10de869037': { tags: ['vauban', 'lieu', 'photo'], alt: 'Centre Culturel Vauban', category: 'lieu' },
  '694e85381c31bb10de869185': { tags: ['design', 'vauban', 'navigation'], alt: 'Centre Vauban design', category: 'design' },

  // === FESTIVALS ===
  '694e85381c31bb10de869160': { tags: ['design', 'festival', 'rencarts'], alt: 'Festival Rencarts', category: 'design' },
  '694e85381c31bb10de86918e': { tags: ['design', 'festival', 'tota-familia'], alt: 'Festival Tota Familia', category: 'design' },

  // === RESIDENCES ===
  '694e85381c31bb10de86918b': { tags: ['design', 'residence', 'navigation'], alt: 'Residences artistiques', category: 'design' },

  // === EVENEMENTS / PHOTOS DIVERSES ===
  '694e85381c31bb10de869025': { tags: ['evenement', 'photo'], alt: 'Photo evenement', category: 'evenement' },
  '694e85381c31bb10de869022': { tags: ['evenement', 'photo'], alt: 'Photo evenement', category: 'evenement' },
  '694e85381c31bb10de86901f': { tags: ['evenement', 'photo'], alt: 'Photo evenement', category: 'evenement' },
  '694e85381c31bb10de86901c': { tags: ['evenement', 'photo'], alt: 'Photo evenement', category: 'evenement' },
  '694e85381c31bb10de869019': { tags: ['evenement', 'photo'], alt: 'Photo evenement', category: 'evenement' },
  '694e85381c31bb10de869016': { tags: ['evenement', 'photo'], alt: 'Photo evenement', category: 'evenement' },
  '694e85381c31bb10de869013': { tags: ['evenement', 'photo'], alt: 'Photo evenement', category: 'evenement' },

  // === DOCUMENTS ADMINISTRATIFS ===
  '694e85381c31bb10de869010': { tags: ['document', 'formation', 'administratif'], alt: 'Formation professionnelle Tota Compania', category: 'document' },
  '694e85381c31bb10de8691bb': { tags: ['document', 'vhss', 'administratif'], alt: 'Protocole de signalement VHSS', category: 'document' },
  '694e85381c31bb10de8691b2': { tags: ['document', 'vhss', 'administratif'], alt: 'Formulaire de signalement VHSS', category: 'document' },
  '694e85381c31bb10de8691ac': { tags: ['document', 'fiche-tarifaire'], alt: 'Fiche Tarifaire VDT', category: 'document' },
  '694e85381c31bb10de8691a6': { tags: ['document', 'fiche-tarifaire', 'ne-songez'], alt: 'Fiche Tarifaire Ne Songez', category: 'document' },
  '694e85381c31bb10de8691a3': { tags: ['document', 'fiche-tarifaire', 'contes-du-monde'], alt: 'Fiche Tarifaire Contes du Monde', category: 'document' },

  // === SAISON 2025-2026 ===
  '694e85391c31bb10de8691fa': { tags: ['saison', '2025-2026', 'programme'], alt: 'Programme Saison 2025-2026 page 16', category: 'design' },
  '694e85391c31bb10de8691f7': { tags: ['saison', '2025-2026', 'programme'], alt: 'Programme Saison 2025-2026 page 15', category: 'design' },
  '694e85391c31bb10de8691f4': { tags: ['saison', '2025-2026', 'programme'], alt: 'Programme Saison 2025-2026 page 14', category: 'design' },
  '694e85391c31bb10de8691f1': { tags: ['saison', '2025-2026', 'programme'], alt: 'Programme Saison 2025-2026 page 12', category: 'design' },
  '694e85391c31bb10de8691dc': { tags: ['saison', 'hiver', 'programme'], alt: 'Programme Hiver Tota', category: 'design' },

  // === NAVIGATION / UI ===
  '694e85381c31bb10de869188': { tags: ['design', 'navigation', 'dates'], alt: 'Prochaines dates', category: 'design' },
  '694e85381c31bb10de86915a': { tags: ['design', 'contact', 'formulaire'], alt: 'Formulaire contact', category: 'design' },
  '694e85381c31bb10de869157': { tags: ['design', 'ca', 'navigation'], alt: 'CA design', category: 'design' },
};

// API endpoint
const API_BASE = 'http://localhost:3101/api/admin/media';

async function updateMedia(id: string, updates: { tags: string[], alt?: string, category?: string }) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (response.ok) {
      console.log(`✓ Updated ${id}`);
    } else {
      console.error(`✗ Failed ${id}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`✗ Error ${id}:`, error);
  }
}

async function main() {
  console.log('Starting media retagging...');
  console.log(`Processing ${Object.keys(mediaUpdates).length} items\n`);

  for (const [id, updates] of Object.entries(mediaUpdates)) {
    await updateMedia(id, updates);
    // Small delay to avoid overwhelming the server
    await new Promise(r => setTimeout(r, 50));
  }

  console.log('\nRetagging complete!');
}

main().catch(console.error);
