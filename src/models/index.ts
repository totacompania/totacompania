import mongoose, { Schema, Document, Model } from 'mongoose';

// ========================================
// User (Admin)
// ========================================
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
}, { timestamps: true });

// ========================================
// Spectacle
// ========================================
export interface ISpectacle extends Document {
  slug: string;
  title: string;
  subtitle?: string;
  ageRange?: string;
  audience?: string;
  duration?: string;
  description: string;
  longDescription?: string;
  content?: string;
  image: string;
  gallery: string[];
  category: 'conte' | 'théâtre' | 'marionnettes' | 'tout-public' | 'spectacle' | 'animation';
  available: boolean;
  published?: boolean;
  featured?: boolean;
  cast?: string;
  technicalInfo?: string;
  videoUrl?: string;
  distribution?: string;
  partenaires?: string[];
  dossierUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SpectacleSchema = new Schema<ISpectacle>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: String,
  ageRange: String,
  audience: String,
  duration: String,
  description: { type: String, required: true },
  longDescription: String,
  content: String,
  image: { type: String, required: true },
  gallery: [String],
  category: { type: String, enum: ['conte', 'théâtre', 'marionnettes', 'tout-public', 'spectacle', 'animation'], default: 'spectacle' },
  available: { type: Boolean, default: true },
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  cast: String,
  technicalInfo: String,
  videoUrl: String,
  distribution: String,
  partenaires: [String],
  dossierUrl: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

// ========================================
// Event
// ========================================
export interface IEvent extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  date: Date;
  endDate?: Date;
  time?: string;
  location: string;
  price?: string;
  ageRange?: string;
  type: 'spectacle' | 'stage' | 'inscription' | 'residence';
  address?: string;
  endTime?: string;
  ticketUrl?: string;
  externalUrl?: string;
  image?: string;
  spectacleId?: mongoose.Types.ObjectId;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  date: { type: Date, required: true },
  endDate: Date,
  time: String,
  location: { type: String, required: true },
  price: String,
  ageRange: String,
  type: { type: String, enum: ['spectacle', 'stage', 'inscription', 'residence'], required: true },
  address: String,
  endTime: String,
  ticketUrl: String,
  externalUrl: String,
  image: String,
  spectacleId: { type: Schema.Types.ObjectId, ref: 'Spectacle' },
  published: { type: Boolean, default: true },
}, { timestamps: true });

// ========================================
// Article (Actualités)
// ========================================
export interface IArticle extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  author: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  category: { type: String, default: 'actualite' },
  author: { type: String, default: 'Tota Compania' },
  published: { type: Boolean, default: false },
  publishedAt: Date,
}, { timestamps: true });

// ========================================
// Document (PDFs, fichiers)
// ========================================
export interface IDocument extends Document {
  title: string;
  description?: string;
  file: string;
  type: 'pdf' | 'image' | 'other';
  category: 'formation' | 'administratif' | 'pedagogique' | 'presse' | 'autre';
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  description: String,
  file: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'image', 'other'], default: 'pdf' },
  category: { type: String, enum: ['formation', 'administratif', 'pedagogique', 'presse', 'autre'], default: 'autre' },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

// ========================================
// Partner
// ========================================
export interface IPartner extends Document {
  name: string;
  logo?: string;
  mediaId?: string;
  website?: string;
  description?: string;
  category: 'institutionnel' | 'prive' | 'culturel' | 'media' | 'education' | 'local';
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>({
  name: { type: String, required: true },
  logo: String,
  mediaId: String,
  website: String,
  description: String,
  category: { type: String, enum: ['institutionnel', 'prive', 'culturel', 'media', 'education', 'local'], default: 'institutionnel' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// ========================================
// Media (Médiathèque)
// ========================================
export interface IMediaUsage {
  model: string;
  id: string;
  field: string;
}

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  alt?: string;
  caption?: string;
  category?: string;
  tags: string[];
  folder?: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailPath?: string;
  usedIn: IMediaUsage[];
  showInGallery: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaUsageSchema = new Schema<IMediaUsage>({
  model: { type: String, required: true },
  id: { type: String, required: true },
  field: { type: String, required: true },
}, { _id: false });

const MediaSchema = new Schema<IMedia>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  category: { type: String, default: 'général' },
  tags: { type: [String], default: [] },
  folder: { type: String, default: '/' },
  width: Number,
  height: Number,
  duration: Number,
  thumbnailPath: String,
  usedIn: { type: [MediaUsageSchema], default: [] },
  showInGallery: { type: Boolean, default: false },
}, { timestamps: true });

// ========================================
// Message (Contact)
// ========================================
export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

// ========================================
// Settings
// ========================================
export interface ISetting extends Document {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  type: { type: String, enum: ['string', 'number', 'boolean', 'json'], default: 'string' },
  description: String,
}, { timestamps: true });

// ========================================
// Team Member
// ========================================
export interface ITeamMemberRole {
  title: string;
  category: 'equipe' | 'artiste' | 'conseil';
}

export interface ITeamMember extends Document {
  name: string;
  roles: ITeamMemberRole[];
  bio?: string;
  image?: string;
  imagePath?: string;
  mediaId?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberRoleSchema = new Schema<ITeamMemberRole>({
  title: { type: String, required: true },
  category: { type: String, enum: ['equipe', 'artiste', 'conseil'], required: true },
}, { _id: false });

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  roles: { type: [TeamMemberRoleSchema], default: [] },
  bio: String,
  image: String,
  imagePath: String,
  mediaId: String,
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// ========================================
// Festival
// ========================================
export interface IFestival extends Document {
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  image?: string;
  mediaId?: string;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FestivalSchema = new Schema<IFestival>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subtitle: String,
  description: { type: String, required: true },
  longDescription: String,
  image: String,
  mediaId: String,
  startDate: Date,
  endDate: Date,
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

// ========================================
// Stage (Workshops)
// ========================================
export interface IStage extends Document {
  title: string;
  theme?: string;
  description?: string;
  ageRange: string;
  startDate: Date;
  endDate: Date;
  location: string;
  price?: string;
  maxParticipants?: number;
  mediaId?: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const StageSchema = new Schema<IStage>({
  title: { type: String, required: true },
  theme: String,
  description: String,
  ageRange: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  price: String,
  maxParticipants: Number,
  mediaId: String,
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

// ========================================
// Résidence
// ========================================
export interface IRésidence extends Document {
  name: string;
  artist: string;
  year: string;
  description: string;
  image?: string;
  mediaId?: string;
  startDate?: Date;
  endDate?: Date;
  rendezVous?: Date;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const RésidenceSchema = new Schema<IRésidence>({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  mediaId: String,
  startDate: Date,
  endDate: Date,
  rendezVous: Date,
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

// ========================================
// Page (Dynamic pages)
// ========================================
export interface IPage extends Document {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  metaTitle: String,
  metaDescription: String,
  published: { type: Boolean, default: true },
}, { timestamps: true });

// ========================================
// Newsletter Subscriber
// ========================================
export interface INewsletterSubscriber extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: 'website' | 'import' | 'admin';
  unsubscribeToken: string;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  status: { type: String, enum: ['active', 'unsubscribed', 'bounced'], default: 'active' },
  source: { type: String, enum: ['website', 'import', 'admin'], default: 'website' },
  unsubscribeToken: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
  tags: { type: [String], default: [] },
}, { timestamps: true });

// ========================================
// Newsletter Campaign
// ========================================
export interface INewsletterCampaign extends Document {
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterCampaignSchema = new Schema<INewsletterCampaign>({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft', 'scheduled', 'sending', 'sent'], default: 'draft' },
  scheduledAt: Date,
  sentAt: Date,
  recipientCount: { type: Number, default: 0 },
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
}, { timestamps: true });

// ========================================
// Export Models
// ========================================
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Spectacle: Model<ISpectacle> = mongoose.models.Spectacle || mongoose.model<ISpectacle>('Spectacle', SpectacleSchema);
export const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
export const DocumentModel: Model<IDocument> = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
export const Partner: Model<IPartner> = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);
export const Media: Model<IMedia> = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
export const TeamMember: Model<ITeamMember> = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const Festival: Model<IFestival> = mongoose.models.Festival || mongoose.model<IFestival>('Festival', FestivalSchema);
export const Stage: Model<IStage> = mongoose.models.Stage || mongoose.model<IStage>('Stage', StageSchema);
export const Résidence: Model<IRésidence> = mongoose.models.Résidence || mongoose.model<IRésidence>('Résidence', RésidenceSchema);
export const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
export const NewsletterSubscriber: Model<INewsletterSubscriber> = mongoose.models.NewsletterSubscriber || mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);
export const NewsletterCampaign: Model<INewsletterCampaign> = mongoose.models.NewsletterCampaign || mongoose.model<INewsletterCampaign>('NewsletterCampaign', NewsletterCampaignSchema);

// ========================================
// Theater Group (Ecole de Theatre)
// ========================================
export interface ITheaterGroup extends Document {
  name: string;
  ageRange: string;
  description?: string;
  schedule?: string;
  location?: string;
  price?: number;
  memberPrice?: number;
  color?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TheaterGroupSchema = new Schema<ITheaterGroup>({
  name: { type: String, required: true },
  ageRange: { type: String, required: true },
  description: String,
  schedule: String,
  location: String,
  price: Number,
  memberPrice: Number,
  color: { type: String, default: 'bg-primary' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// ========================================
// Intervention (Scolaires)
// ========================================
export interface IIntervention extends Document {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InterventionSchema = new Schema<IIntervention>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Theater' },
  color: { type: String, default: 'bg-primary' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const TheaterGroup: Model<ITheaterGroup> = mongoose.models.TheaterGroup || mongoose.model<ITheaterGroup>('TheaterGroup', TheaterGroupSchema);
export const Intervention: Model<IIntervention> = mongoose.models.Intervention || mongoose.model<IIntervention>('Intervention', InterventionSchema);
