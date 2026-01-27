/**
 * Script pour importer les donnees hardcodees dans MongoDB
 * Usage: npx ts-node scripts/seed-content.ts
 * Ou via API: POST /api/admin/seed
 */

import mongoose from 'mongoose';

// Configuration MongoDB - ajuster selon votre environnement
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://192.168.1.29:27017/totacompania';

// Donnees de l'equipe
const teamMembers = [
  { name: 'Maeva Beys', role: 'Administratrice', category: 'equipe', mediaId: '694e85381c31bb10de8690d3', order: 0 },
  { name: 'Mathis Desaintmartin', role: 'Regisseur', category: 'equipe', mediaId: '694e85381c31bb10de8690bb', order: 1 },
  { name: 'Anabelle Protat', role: 'Musicienne', category: 'equipe', mediaId: '694e85381c31bb10de8690d9', order: 2 },
  { name: 'Florent Kubler', role: 'Scenographe', category: 'equipe', mediaId: '694e85381c31bb10de8690e8', order: 3 },
  { name: 'Juliette Colin', role: 'Decoratrice et Costumiere', category: 'equipe', mediaId: '694e85381c31bb10de8690b8', order: 4 },
  { name: 'Eliott Lichtenberger', role: 'Pole Video', category: 'equipe', mediaId: '694e85381c31bb10de8690d0', order: 5 },
  { name: 'Juliette Hoefler', role: 'Graphiste', category: 'equipe', mediaId: '694e85381c31bb10de8690d6', order: 6 },
  { name: 'Prescilla Durand', role: 'Communication', category: 'equipe', mediaId: '694e85381c31bb10de8690dc', order: 7 },
];

const artistMembers = [
  { name: 'Catherine Fauve', role: 'Directrice artistique', category: 'artiste', mediaId: '694e85381c31bb10de8690df', order: 0 },
  { name: 'Charlene Francois', role: 'Comedienne', category: 'artiste', mediaId: '694e85381c31bb10de8690e2', order: 1 },
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

// Festivals
const festivals = [
  {
    slug: 'tota-familia',
    name: 'TOTA FAMILIA',
    subtitle: 'Festival de theatre amateur',
    description: "C'est le grand retour de Tota Familia ! Nouvelle saison, nouvelle edition de notre festival amateur ! Les groupes Tot'apaloeil et Tot'agrippine montent sur scene pour vous offrir des moments d'emotion a partager tous ensemble.",
    active: true,
    order: 0,
  },
  {
    slug: 'rencarts',
    name: "Les Renc'Arts",
    subtitle: 'Programmation jeune public',
    description: "Les Renc'Arts evoluent... on garde le nom parce qu'il nous raconte dix ans d'aventures avec nos publics, mais la forme change : on vous donne « Renc'Arts » avec des spectacles professionnels invites pour une belle programmation jeune public toute l'annee.",
    active: true,
    order: 1,
  },
];

// Stages
const stages = [
  {
    title: 'Comment raconter une Histoire ? #1',
    theme: "La narration au fil de l'histoire",
    ageRange: '6-12 ans - Novices bienvenus',
    startDate: new Date('2025-10-20'),
    endDate: new Date('2025-10-23'),
    location: 'Centre Culturel Vauban a Toul',
    price: '155€ | 145€ pour les adherents',
    published: true,
    order: 0,
  },
];

// Residences
const residences = [
  {
    name: 'Residence ALLIVM',
    year: '2020',
    artist: 'Anabelle Protat',
    description: "Anabelle Protat est une jeune artiste musicienne qui evolue sous le nom d'ALLIVM dans des projets musicaux personnels et touchants. Au travers de ses textes et de ses clips, elle interroge sur les violences, les discriminations, la decouverte de soi et de l'autre.",
    published: true,
    order: 0,
  },
];

// Partenaires
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
  { name: 'Theatre de la Manufacture', category: 'culturel', order: 9 },
  { name: 'Opera National de Lorraine', category: 'culturel', order: 10 },
  { name: 'Mediatheques de Nancy', category: 'culturel', order: 11 },
  { name: 'MJC de la region', category: 'culturel', order: 12 },
];

// Settings (company info, contact, vauban)
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
      intro: "Depuis 1997, la compagnie de theatre professionnelle TOTA COMPANIA cree, ecrit, propose des spectacles poetiques et lumineux pour petits et grands enfants.",
      education: "Dans une demarche bienveillante, TOTA COMPANIA propose un parcours d'education artistique des 4 ans et jusqu'a l'age adulte aupres de pres d'une centaine d'amateurs/trices, leur proposant des stages pratiques aux enfants et adolescents.",
      festivals: "Chaque mois de decembre voit la creation d'un nouveau spectacle pour les familles et une dizaine d'artistes sont ainsi accueilli lors du festival jeune public de spectacle vivant « Renc'Arts » lors du festival de theatre « Tota Familia » en partenariat avec le Theatre du Moulin a TOUL.",
      engagement: "Dans la Region Grand Est, TOTA COMPANIA s'investit pour contribuer a eveiller les jeunes publics autrement et leur faire decouvrir de nouvelles manieres de consommer : les spectacles allient ainsi avec les notions de theatre participatif d'initier le sujet des violences, des discriminations, de la tolerance, la pollution... Le theatre est utilise en tant qu'outil pedagogique, amenant les classes a reflechir active sur la societe qui les entoure."
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
        street: "3 rue des Anciens Combattants d'Afrique du Nord",
        city: '54200 TOUL',
        alias: 'Theatre du Moulin'
      },
      social: {
        facebook: 'https://www.facebook.com/totacompania',
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
      alias: 'Theatre du Moulin',
      mediaId: '694e85381c31bb10de86900a',
      history: "Gracieusement mis a disposition par la Ville de Toul, le Centre Culturel Vauban (historiquement connu sous le nom de Theatre du Moulin) est un lieu culturel partage implante dans les anciens remparts Vauban : un des tresors caches de la ville !",
      programming: "La programmation du lieu est principalement celle proposee par ses quatre associations theatrales residentes, mais il est egalement ponctuellement mis a disposition d'autres structures.",
      accessibility: "Le theatre, completement accessible aux personnes a mobilite reduite, est constitue :",
      facilities: [
        "d'un grand hall avec buvette associative, canapes, tables et chaises",
        "de vestiaires, espace poussettes",
        "d'une salle de 100 spectateurs",
        "d'un petit atelier, de loges et d'une cuisine"
      ],
      address: "Centre Culturel Vauban, rue des Anciens Combattants d'Afrique du Nord, 54200 TOUL"
    }),
    type: 'json',
    description: 'Informations du Centre Culturel Vauban'
  },
];

// Schemas simplifies pour le seed
const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  category: String,
  bio: String,
  image: String,
  mediaId: String,
  order: Number,
  active: { type: Boolean, default: true },
}, { timestamps: true });

const FestivalSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  name: String,
  subtitle: String,
  description: String,
  longDescription: String,
  image: String,
  mediaId: String,
  startDate: Date,
  endDate: Date,
  active: Boolean,
  order: Number,
}, { timestamps: true });

const StageSchema = new mongoose.Schema({
  title: String,
  theme: String,
  description: String,
  ageRange: String,
  startDate: Date,
  endDate: Date,
  location: String,
  price: String,
  maxParticipants: Number,
  mediaId: String,
  published: Boolean,
  order: Number,
}, { timestamps: true });

const ResidenceSchema = new mongoose.Schema({
  name: String,
  artist: String,
  year: String,
  description: String,
  image: String,
  mediaId: String,
  startDate: Date,
  endDate: Date,
  rendezVous: Date,
  published: Boolean,
  order: Number,
}, { timestamps: true });

const PartnerSchema = new mongoose.Schema({
  name: String,
  logo: String,
  mediaId: String,
  website: String,
  description: String,
  category: String,
  order: Number,
  active: { type: Boolean, default: true },
}, { timestamps: true });

const SettingSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: String,
  type: String,
  description: String,
}, { timestamps: true });

async function seed() {
  try {
    console.log('Connexion a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connecte a MongoDB');

    // Get or create models
    const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
    const Festival = mongoose.models.Festival || mongoose.model('Festival', FestivalSchema);
    const Stage = mongoose.models.Stage || mongoose.model('Stage', StageSchema);
    const Residence = mongoose.models.Residence || mongoose.model('Residence', ResidenceSchema);
    const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
    const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

    // Seed team members
    console.log('Import des membres de l\'equipe...');
    const allTeamMembers = [...teamMembers, ...artistMembers, ...boardMembers];
    for (const member of allTeamMembers) {
      await TeamMember.findOneAndUpdate(
        { name: member.name, category: member.category },
        { ...member, active: true },
        { upsert: true, new: true }
      );
    }
    console.log(`${allTeamMembers.length} membres importes`);

    // Seed festivals
    console.log('Import des festivals...');
    for (const festival of festivals) {
      await Festival.findOneAndUpdate(
        { slug: festival.slug },
        festival,
        { upsert: true, new: true }
      );
    }
    console.log(`${festivals.length} festivals importes`);

    // Seed stages
    console.log('Import des stages...');
    for (const stage of stages) {
      await Stage.findOneAndUpdate(
        { title: stage.title, startDate: stage.startDate },
        stage,
        { upsert: true, new: true }
      );
    }
    console.log(`${stages.length} stages importes`);

    // Seed residences
    console.log('Import des residences...');
    for (const residence of residences) {
      await Residence.findOneAndUpdate(
        { name: residence.name, year: residence.year },
        residence,
        { upsert: true, new: true }
      );
    }
    console.log(`${residences.length} residences importees`);

    // Seed partners
    console.log('Import des partenaires...');
    for (const partner of partners) {
      await Partner.findOneAndUpdate(
        { name: partner.name },
        { ...partner, active: true },
        { upsert: true, new: true }
      );
    }
    console.log(`${partners.length} partenaires importes`);

    // Seed settings
    console.log('Import des parametres...');
    for (const setting of settings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true }
      );
    }
    console.log(`${settings.length} parametres importes`);

    console.log('\n✅ Seed complete !');
    console.log('Resume:');
    console.log(`  - ${allTeamMembers.length} membres de l'equipe`);
    console.log(`  - ${festivals.length} festivals`);
    console.log(`  - ${stages.length} stages`);
    console.log(`  - ${residences.length} residences`);
    console.log(`  - ${partners.length} partenaires`);
    console.log(`  - ${settings.length} parametres`);

  } catch (error) {
    console.error('Erreur lors du seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Deconnecte de MongoDB');
  }
}

// Run if called directly
seed();
