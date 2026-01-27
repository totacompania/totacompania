import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Spectacle } from '@/models';

// Donnees des spectacles de Tota Compania
const spectaclesData = [
  {
    slug: 'colorez-moi',
    title: 'Colorez-moi',
    subtitle: 'Un spectacle sensoriel et poétique',
    description: 'Un spectacle visuel et sensoriel pour les tout-petits. A travers les couleurs, les textures et les sons, les enfants decouvrent un monde poétique et enchante.',
    longDescription: 'Colorez-moi est un spectacle sensoriel destine aux tout-petits (des 2 ans).\n\nDans un espace de jeu tout blanc, deux personnages vont progressivement faire apparaître les couleurs. Rouge, jaune, bleu... chaque teinte revele une emotion, un univers.\n\nLes enfants sont invites a participer, a toucher, a ressentir. Un moment de partage entre petits et grands, ou on redécouvre ensemble la magie des premières sensations.\n\nCe spectacle a ete crée en 2019 et tourné régulièrement dans les crèches, les RAM et les festivals jeune public.',
    ageRange: 'Des 2 ans',
    audience: 'Jeune public - Petite enfance',
    duration: '30 minutes',
    category: 'spectacle',
    cast: '2 comediennes',
    technicalInfo: 'Spectacle en salle. Jauge: 60 enfants + accompagnateurs. Espace scenique: 4m x 4m.',
    image: '/uploads/spectacles/colorez-moi.jpg',
    available: true,
    published: true,
    order: 1
  },
  {
    slug: 'les-contes-blancs',
    title: 'Les Contes Blancs',
    subtitle: 'Contes dhiver et de neige',
    description: 'Des contes venus du froid, ou la neige, le silence et la lumiere tissent des histoires magiques pour petits et grands reveurs.',
    longDescription: 'Les Contes Blancs est un spectacle de contes qui nous emmène dans les paysages enneigés du Grand Nord.\n\nA travers trois histoires poétiques, nous explorons les themes de hiver, du silence, de la solitude et du partage. La neige devient un personnage a part entière, tantôt douce, tantôt cruelle, toujours magique.\n\nUn spectacle contemplatif et chaleureux, ideal pour les fetes de fin d\'année.\n\nCette création a ete présentée lors du festival Tota Familia et tourné depuis dans toute la region Grand Est.',
    ageRange: 'Des 6 ans',
    audience: 'Tout public familial',
    duration: '50 minutes',
    category: 'conte',
    cast: '1 conteur, 1 musicien',
    technicalInfo: 'Spectacle en salle. Noir salle souhaite. Espace scenique: 5m x 4m.',
    image: '/uploads/spectacles/contes-blancs.jpg',
    available: true,
    published: true,
    order: 2
  },
  {
    slug: 'vert-de-terre',
    title: 'Vert de Terre',
    subtitle: 'Un conte ecologique',
    description: 'Un conte musical et ecologique destine aux plus jeunes. A travers histoire d\'un petit ver de terre curieux, on decouvre les merveilles de la nature.',
    longDescription: 'Vert de Terre est un conte musical et ecologique destine aux plus jeunes.\n\nA travers histoire d\'un petit ver de terre curieux, nous abordons les themes de ecologie, du respect de la nature et de la biodiversite.\n\nUn spectacle interactif ou les enfants sont invites a participer, chanter et découvrir les merveilles de la nature.\n\nIdeal pour les maternelles et les debuts de primaire, ce spectacle peut etre suivi d\'un atelier pedagogique.',
    ageRange: 'Des 4 ans',
    audience: 'Maternelle et CP',
    duration: '45 minutes',
    category: 'conte',
    cast: '1 comedienne, 1 musicien',
    technicalInfo: 'Peut se jouer partout. Espace minimum: 3m x 3m. Atelier possible en complement.',
    image: '/uploads/spectacles/vert-de-terre.jpg',
    available: true,
    published: true,
    order: 3
  },
  {
    slug: 'piteur-vieux',
    title: 'Piteur Vieux',
    subtitle: 'Une histoire sur le temps qui passe',
    description: 'Une piece de théâtre touchante qui aborde avec delicatesse le theme du vieillissement et de la transmission entre generations.',
    longDescription: 'Piteur Vieux est une piece de théâtre qui aborde avec delicatesse le theme du vieillissement et de la transmission.\n\nA travers le personnage de Piteur, vieux bonhomme attachant et facetieux, nous explorons ce que signifie grandir, vieillir, et transmettre ce que on sait.\n\nUn spectacle plein d\'humour et d\'émotion, qui touche toutes les generations.\n\nCette création a recu le prix du public au festival RencArts 2019.',
    ageRange: 'Des 8 ans',
    audience: 'Tout public familial',
    duration: '1 heure',
    category: 'théâtre',
    cast: '1 comedien',
    technicalInfo: 'Spectacle en salle. Espace scenique minimum: 4m x 3m. Noir salle souhaite.',
    image: '/uploads/spectacles/piteur-vieux.jpg',
    available: true,
    published: true,
    order: 4
  },
  {
    slug: 'xy-et-moi',
    title: 'XY et Moi',
    subtitle: 'Théâtre et marionnettes',
    description: 'Un spectacle de marionnettes qui interroge notre rapport a autre et a la difference, avec humour et sensibilite.',
    longDescription: 'XY et Moi est un spectacle qui mele théâtre et marionnettes.\n\nSur scène, une marionnettiste et son double de tissu explorent la question de identite, de alterite et du rapport a autre.\n\nQui suis-je? Qui es-tu? Comment vivre ensemble avec nos differences?\n\nUn spectacle drole et touchant, qui invite petits et grands a reflechir sur ce qui nous rend uniques.',
    ageRange: 'Des 5 ans',
    audience: 'Tout public familial',
    duration: '45 minutes',
    category: 'marionnettes',
    cast: '1 comedienne-marionnettiste',
    technicalInfo: 'Spectacle en salle. Espace scenique: 4m x 3m.',
    image: '/uploads/spectacles/xy-et-moi.jpg',
    available: true,
    published: true,
    order: 5
  },
  {
    slug: 'ne-songez-pas',
    title: 'Ne Songez Pas',
    subtitle: 'Reveries theatrales',
    description: 'Un voyage onirique dans univers des reves et des songes, entre théâtre et poesie visuelle.',
    longDescription: 'Ne Songez Pas est une création theatrale qui explore univers des reves.\n\nSur scène, deux personnages naviguent entre eveil et sommeil, réalité et imaginaire. Les frontieres s\'effacent, les reves prennent forme.\n\nUn spectacle poétique et visuel, qui invite le spectateur a plonger dans son propre monde intérieur.\n\nCréé en 2020, ce spectacle a ete présenté dans plusieurs festivals de théâtre visuel.',
    ageRange: 'Des 10 ans',
    audience: 'Tout public',
    duration: '1h10',
    category: 'théâtre',
    cast: '2 comediens',
    technicalInfo: 'Spectacle en salle. Noir salle indispensable. Espace scenique: 6m x 5m.',
    image: '/uploads/spectacles/ne-songez-pas.jpg',
    available: true,
    published: true,
    order: 6
  }
];

export async function POST() {
  try {
    await connectDB();

    // Verifier si des spectacles existent deja
    const existingCount = await Spectacle.countDocuments();

    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `${existingCount} spectacles existent deja. Supprimez-les d\'abord si vous voulez réimporter.`,
        count: existingCount
      });
    }

    // Importer les spectacles
    const inserted = await Spectacle.insertMany(spectaclesData);

    return NextResponse.json({
      success: true,
      message: `${inserted.length} spectacles importes avec succes`,
      count: inserted.length
    });
  } catch (error) {
    console.error('Error seeding spectacles:', error);
    return NextResponse.json({ error: 'Failed to seed spectacles' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await Spectacle.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} spectacles supprimes`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting spectacles:', error);
    return NextResponse.json({ error: 'Failed to delete spectacles' }, { status: 500 });
  }
}
