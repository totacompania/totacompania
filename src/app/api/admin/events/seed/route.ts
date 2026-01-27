import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/models';

// Donnees de la programmation 2025-2026 a importer
const programmationData = [
  // Septembre
  {
    date: '2025-09-06',
    time: '13h30 a 18h30',
    title: 'INSCRIPTIONS !',
    subtitle: 'aux ateliers théâtre annuels (groupes de 6 a 18 ans)',
    location: "Salle de l'Arsenal à Toul (Forum des associations)",
    type: 'inscription' as const,
  },
  {
    date: '2025-09-10',
    time: '10h a 12h',
    title: 'INSCRIPTIONS !',
    location: 'Centre Culturel Vauban à Toul',
    type: 'inscription' as const,
  },
  {
    date: '2025-09-01',
    endDate: '2025-09-06',
    title: 'RESIDENCE EMERGENTE - Cie Les Evades',
    subtitle: 'Rendu de résidence samedi 6 septembre a 20h',
    description: '"Tout ira bien" - adaptation du roman "La joie nous portera" de Prescilla Durand.',
    location: 'Centre Culturel Vauban a TOUL',
    price: 'Gratuit, contribution solidaire au chapeau',
    type: 'résidence' as const,
  },
  {
    date: '2025-09-19',
    time: 'des 19h',
    title: 'LANCEMENT DE SAISON FESTIF',
    description: "Venez trinquer a la nouvelle saison theatrale de Tota Compania ! L'occasion de découvrir notre programmation annuelle.",
    location: 'Centre Culturel Vauban (Théâtre du Moulin)',
    price: 'Entree libre - Tout public',
    type: 'festival' as const,
  },
  // Octobre
  {
    date: '2025-10-04',
    time: '15h',
    title: "FESTIVAL RENC'ARTS - Les 10 ans, le final !",
    subtitle: 'Spectacle "Sorcieres" - Cie Encore',
    ageRange: 'Tout public - a partir de 8 ans',
    description: 'Nez crochu et balai sous le bras, la sorciere fait peur. Elle fascine, autant qu\'elle repulse.',
    location: 'Centre Culturel Vauban à Toul',
    price: 'GRATUIT - contribution solidaire au chapeau',
    type: 'festival' as const,
  },
  {
    date: '2025-10-11',
    time: '15h',
    title: "FESTIVAL RENC'ARTS",
    subtitle: 'Spectacle "Le petit chaperon Uf" - Cie Intranquille',
    ageRange: 'Tout public - a partir de 7 ans',
    location: 'Salle des fetes de Pierre-la-Treiche',
    price: 'GRATUIT - contribution solidaire au chapeau',
    type: 'festival' as const,
  },
  {
    date: '2025-10-20',
    endDate: '2025-10-30',
    title: 'STAGES DE THEATRE - Comment raconter une Histoire ? #1',
    subtitle: 'Pour les 6-12 ans - Novices bienvenus',
    description: 'Theme "La narration au fil de l\'histoire" : Homere, Le Roman de Renard, Alexandre Dumas, Charles Perrault, Claude Ponti...',
    location: 'Centre Culturel Vauban à Toul',
    price: '155e | 145e pour les adherents',
    ageRange: '6-12 ans',
    type: 'stage' as const,
  },
  // Decembre
  {
    date: '2025-12-04',
    endDate: '2025-12-14',
    title: 'FESTIVAL TOTA FAMILIA - Winter Edition',
    description: "C'est le grand retour de Tota Familia ! Nouvelle saison, nouvelle edition de notre festival amateur !",
    location: 'Centre Culturel Vauban, 3 rue des AFN, 54200 TOUL',
    type: 'festival' as const,
  },
  {
    date: '2025-12-04',
    time: '20h30',
    title: 'Spectacle "Le Conte d\'Hiver"',
    subtitle: "par l'Atelier Maitrise de Tota Compania l'École",
    description: 'C\'est un conte curieusement moderné que Shakespeare nous livre.',
    location: 'Centre Culturel Vauban',
    price: 'Tarif plein : 12e - Tarif reduit : 8e',
    type: 'spectacle' as const,
  },
  {
    date: '2025-12-11',
    time: '20h30',
    title: 'Spectacle "Le porteur d\'Histoires"',
    subtitle: "par l'Atelier Adultes de Tota Compania l'École",
    description: '"Chacun sait que les histoires sont imaginaires..." - Paul Auster',
    location: 'Centre Culturel Vauban',
    price: 'Tarif plein : 12e - Tarif reduit : 8e',
    type: 'spectacle' as const,
  },
  // Janvier
  {
    date: '2026-01-05',
    time: '20h a 22h',
    title: 'INSCRIPTIONS ! - Atelier Adulte',
    subtitle: 'pre-inscriptions des décembre 2025',
    location: 'Centre Culturel Vauban à Toul',
    type: 'inscription' as const,
  },
  {
    date: '2026-01-07',
    time: '19h a 21h',
    title: 'INSCRIPTIONS ! - Atelier Maitrise',
    location: 'Centre Culturel Vauban à Toul',
    type: 'inscription' as const,
  },
  {
    date: '2026-01-09',
    time: '19h',
    title: "LES RENC'ARTS #1",
    subtitle: 'Spectacle "La Bifurque" - Cie Brouniak',
    ageRange: 'des 9 ans',
    location: 'Centre Culturel Vauban, 3 rue des AFN à Toul',
    type: 'spectacle' as const,
  },
  // Fevrier
  {
    date: '2026-02-07',
    time: '11h',
    title: "LES RENC'ARTS - Hors les Murs",
    subtitle: 'Spectacle "Chut" - Cie Brouniak',
    ageRange: 'des 6 mois',
    location: 'Centre Social Jacques Prevert a TOUL',
    price: 'Gratuit (Contribution solidaire au chapeau) - sur reservation',
    type: 'spectacle' as const,
  },
  // Mai
  {
    date: '2026-05-02',
    time: '11h',
    title: "LES RENC'ARTS #2",
    subtitle: 'Spectacle "Les Contes Blancs" - Tota Compania',
    ageRange: 'des 6 ans',
    location: 'Centre Culturel Vauban, 3 rue des AFN à Toul',
    price: 'Gratuit (Contribution solidaire au chapeau) - sur reservation',
    type: 'spectacle' as const,
  },
  {
    date: '2026-05-23',
    time: '11h',
    title: "LES RENC'ARTS #3",
    subtitle: 'Spectacle "Colorez-moi" - Tota Compania',
    ageRange: 'des 2 ans',
    location: 'Espace Andre Malraux, Rue du Clos des Greves à Toul',
    price: 'Gratuit (Contribution solidaire au chapeau) - sur reservation',
    type: 'spectacle' as const,
  },
];

export async function POST() {
  try {
    await connectDB();

    // Verifier si des événements existent deja
    const existingCount = await Event.countDocuments();

    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `${existingCount} événements existent deja. Supprimez-les d'abord si vous voulez réimporter.`,
        count: existingCount
      });
    }

    // Importer les événements
    const events = programmationData.map(item => ({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      date: new Date(item.date),
      endDate: item.endDate ? new Date(item.endDate) : undefined,
      time: item.time,
      location: item.location,
      price: item.price,
      ageRange: item.ageRange,
      type: item.type,
      published: true,
    }));

    const inserted = await Event.insertMany(events);

    return NextResponse.json({
      success: true,
      message: `${inserted.length} événements importes avec succes`,
      count: inserted.length
    });
  } catch (error) {
    console.error('Error seeding events:', error);
    return NextResponse.json({ error: 'Failed to seed events' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await Event.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} événements supprimes`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting events:', error);
    return NextResponse.json({ error: 'Failed to delete events' }, { status: 500 });
  }
}
