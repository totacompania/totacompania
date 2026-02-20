import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamMember, Festival, Stage, Résidence, Partner, Setting } from '@/models';

// Donnees de l\'équipe
const teamMembers = [
  { name: 'Maeva Beys', role: 'Administratrice', category: 'équipe', mediaId: '694e85381c31bb10de8690d3', order: 0 },
  { name: 'Mathis Desaintmartin', role: 'Regisseur', category: 'équipe', mediaId: '694e85381c31bb10de8690bb', order: 1 },
  { name: 'Anabelle Protat', role: 'Musicienne', category: 'équipe', mediaId: '694e85381c31bb10de8690d9', order: 2 },
  { name: 'Florent Kubler', role: 'Scenographe', category: 'équipe', mediaId: '694e85381c31bb10de8690e8', order: 3 },
  { name: 'Juliette Colin', role: 'Decoratrice et Costumiere', category: 'équipe', mediaId: '694e85381c31bb10de8690b8', order: 4 },
  { name: 'Eliott Lichtenberger', role: 'Pole Video', category: 'équipe', mediaId: '694e85381c31bb10de8690d0', order: 5 },
  { name: 'Juliette Hoefler', role: 'Graphiste', category: 'équipe', mediaId: '694e85381c31bb10de8690d6', order: 6 },
  { name: 'Prescilla Durand', role: 'Communication', category: 'équipe', mediaId: '694e85381c31bb10de8690dc', order: 7 },
];

const artistMembers = [
  { name: 'Catherine Fauve', role: 'Directrice artistique', category: 'artiste', mediaId: '694e85381c31bb10de8690df', order: 0 },
  { name: 'Charlené Francois', role: 'Comedienne', category: 'artiste', mediaId: '694e85381c31bb10de8690e2', order: 1 },
  { name: 'Romain Averlant', role: 'Comedien', category: 'artiste', mediaId: '694e85381c31bb10de8690e5', order: 2 },
  { name: 'Bastien Wasser', role: 'Comedien', category: 'artiste', mediaId: '694e85381c31bb10de869124', order: 3 },
  { name: 'Adrien Gusching', role: 'Comedien', category: 'artiste', mediaId: '694e85381c31bb10de869130', order: 4 },
  { name: 'Fantine Siaud', role: 'Comedienne', category: 'artiste', mediaId: '694e85381c31bb10de8691b5', order: 5 },
  { name: 'Mathis Desaintmartin', role: 'Comedien', category: 'artiste', mediaId: '694e85381c31bb10de8691b8', order: 6 },
];

const boardMembers = [
  { name: 'Thomas Sanamane', role: 'President', category: 'conseil', order: 0 },
  { name: 'Camille Colin', role: 'Vice-Presidente', category: 'conseil', order: 1 },
  { name: 'Celeste Rihm', role: 'Tresorier', category: 'conseil', order: 2 },
  { name: 'Eliott Lichtenberger', role: 'Secretaire', category: 'conseil', order: 3 },
  { name: 'Mireille Fourriere', role: 'Membre du CA', category: 'conseil', order: 4 },
  { name: 'Valerie Samson', role: 'Membre du CA', category: 'conseil', order: 5 },
  { name: 'Peneloppe Clercx', role: 'Membre du CA', category: 'conseil', order: 6 },
  { name: 'Antoine Gouy', role: 'Membre du CA', category: 'conseil', order: 7 },
];

const festivals = [
  {
    slug: 'tota-familia',
    name: 'TOTA FAMILIA',
    subtitle: 'Festival de théâtre amateur',
    description: "C\'est le grand retour de Tota Familia ! Nouvelle saison, nouvelle edition de notre festival amateur ! Les groupes Tot\'apaloeil et Tot\'agrippine montent sur scène pour vous offrir des moments d\'emotion a partager tous ensemble.",
    active: true,
    order: 0,
  },
  {
    slug: 'rencarts',
    name: "Les Renc\'Arts",
    subtitle: 'Programmation jeune public',
    description: "Les Renc\'Arts évoluent... on garde le nom parce qu\'il nous raconte dix ans d\'aventures avec nos publics, mais la forme change : on vous donné « Renc\'Arts » avec des spectacles professionnels invites pour une belle programmation jeune public toute l\'annee.",
    active: true,
    order: 1,
  },
];

const stages = [
  {
    title: 'Comment raconter une Histoire ? #1',
    theme: "La narration au fil de l\'histoire",
    ageRange: '6-12 ans - Novices bienvenus',
    startDate: new Date('2025-10-20'),
    endDate: new Date('2025-10-23'),
    location: 'Centre Culturel Vauban à Toul',
    price: '155€ | 145€ pour les adherents',
    published: true,
    order: 0,
  },
];

const résidences = [
  {
    name: 'Résidence ALLIVM',
    year: '2020',
    artist: 'Anabelle Protat',
    description: "Anabelle Protat est une jeune artiste musicienné qui evolue sous le nom d\'ALLIVM dans des projets musicaux personnels et touchants. Au travers de ses textes et de ses clips, elle interroge sur les violences, les discriminations, la decouverte de soi et de l\'autre.",
    published: true,
    order: 0,
  },
];

const partners = [
  { name: 'DRAC Grand Est', category: 'institutionnel', order: 0 },
  { name: 'Region Grand Est', category: 'institutionnel', order: 1 },
  { name: 'Departement de Meurthe-et-Moselle', category: 'institutionnel', order: 2 },
  { name: 'Ville de Nancy', category: 'institutionnel', order: 3 },
  { name: 'Ville de Toul', category: 'institutionnel', order: 4 },
  { name: 'Rectorat de Nancy-Metz', category: 'education', order: 5 },
  { name: 'DSDEN 54', category: 'education', order: 6 },
  { name: 'Canope', category: 'education', order: 7 },
  { name: 'Universites de Lorraine', category: 'education', order: 8 },
  { name: 'Théâtre de la Manufacture', category: 'culturel', order: 9 },
  { name: 'Opera National de Lorraine', category: 'culturel', order: 10 },
  { name: 'Médiathèques de Nancy', category: 'culturel', order: 11 },
  { name: 'MJC de la region', category: 'culturel', order: 12 },
];

const settings = [
  {
    key: 'company_quote',
    value: JSON.stringify({
      text: "ATQUE TOTA COMPANIA AUSSI, SALUS, HONOR, ET ARGENTUM, ATQUE BONUM APPETITUM",
      source: "Replique du Malade Imaginaire de Moliere"
    }),
    type: 'json',
    description: 'Citation de la compagnie'
  },
  {
    key: 'company_description',
    value: JSON.stringify({
      intro: "Depuis 1997, la compagnie de théâtre professionnelle TOTA COMPANIA crée, écrit, propose des spectacles poétiques et lumineux pour petits et grands enfants.",
      education: "Dans une demarche bienveillante, TOTA COMPANIA propose un parcours d\'education artistique des 4 ans et jusqu\'a l\'age adulte aupres de pres d\'une centaine d\'amateurs/trices, leur proposant des stages pratiques aux enfants et adolescents.",
      festivals: "Chaque mois de décembre voit la création d\'un nouveau spectacle pour les familles et une dizaine d\'artistes sont ainsi accueilli lors du festival jeune public de spectacle vivant « Renc\'Arts » lors du festival de théâtre « Tota Familia » en partenariat avec le Théâtre du Moulin à TOUL.",
      engagement: "Dans la Region Grand Est, TOTA COMPANIA s\'investit pour contribuer a eveiller les jeunes publics autrement et leur faire découvrir de nouvelles manieres de consommer : les spectacles allient ainsi avec les notions de théâtre participatif d\'initier le sujet des violences, des discriminations, de la tolerance, la pollution... Le théâtre est utilise en tant qu\'outil pedagogique, amenant les classes a reflechir active sur la societe qui les entoure."
    }),
    type: 'json',
    description: 'Description de la compagnie'
  },
  {
    key: 'contact_info',
    value: JSON.stringify({
      phone: '03.83.62.61.08',
      email: 'contact@totacompania.fr',
      address: {
        name: 'Centre Culturel Vauban',
        street: "3 rue des Anciens Combattants d\'Afrique du Nord",
        city: '54200 TOUL',
        alias: 'Théâtre du Moulin'
      },
      social: {
        facebook: 'https://www.facebook.com/tota.compania.9',
        instagram: 'https://www.instagram.com/totacompania'
      }
    }),
    type: 'json',
    description: 'Informations de contact'
  },
  {
    key: 'vauban_info',
    value: JSON.stringify({
      name: 'Centre Culturel Vauban',
      alias: 'Théâtre du Moulin',
      mediaId: '694e85381c31bb10de86900a',
      history: "Gracieusement mis a disposition par la Ville de Toul, le Centre Culturel Vauban (historiquement connu sous le nom de Théâtre du Moulin) est un lieu culturel partage implante dans les anciens remparts Vauban : un des tresors caches de la ville !",
      programming: "La programmation du lieu est principalement celle proposee par ses quatre associations theatrales residentes, mais il est egalement ponctuellement mis a disposition d\'autres structures.",
      accessibility: "Le théâtre, completement accessible aux personnes a mobilite reduite, est constitue :",
      facilities: [
        "d\'un grand hall avec buvette associative, canapes, tables et chaises",
        "de vestiaires, espace poussettes",
        "d\'une salle de 100 spectateurs",
        "d\'un petit atelier, de loges et d\'une cuisine"
      ],
      address: "Centre Culturel Vauban, rue des Anciens Combattants d\'Afrique du Nord, 54200 TOUL"
    }),
    type: 'json',
    description: 'Informations du Centre Culturel Vauban'
  },
];

export async function POST() {
  try {
    await connectDB();

    const results = {
      teamMembers: 0,
      festivals: 0,
      stages: 0,
      résidences: 0,
      partners: 0,
      settings: 0,
    };

    // Seed team members
    const allTeamMembers = [...teamMembers, ...artistMembers, ...boardMembers];
    for (const member of allTeamMembers) {
      await TeamMember.findOneAndUpdate(
        { name: member.name, category: member.category },
        { ...member, active: true },
        { upsert: true, new: true }
      );
      results.teamMembers++;
    }

    // Seed festivals
    for (const festival of festivals) {
      await Festival.findOneAndUpdate(
        { slug: festival.slug },
        festival,
        { upsert: true, new: true }
      );
      results.festivals++;
    }

    // Seed stages
    for (const stage of stages) {
      await Stage.findOneAndUpdate(
        { title: stage.title, startDate: stage.startDate },
        stage,
        { upsert: true, new: true }
      );
      results.stages++;
    }

    // Seed résidences
    for (const résidence of résidences) {
      await Résidence.findOneAndUpdate(
        { name: résidence.name, year: résidence.year },
        résidence,
        { upsert: true, new: true }
      );
      results.résidences++;
    }

    // Seed partners
    for (const partner of partners) {
      await Partner.findOneAndUpdate(
        { name: partner.name },
        { ...partner, active: true },
        { upsert: true, new: true }
      );
      results.partners++;
    }

    // Seed settings
    for (const setting of settings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true }
      );
      results.settings++;
    }

    return NextResponse.json({
      success: true,
      message: 'Seed complete',
      results,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to run the seed',
    endpoint: '/api/admin/seed',
  });
}
