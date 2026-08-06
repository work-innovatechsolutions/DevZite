/**
 * Global TypeScript types for DevZite
 */

// ─── Firebase / Auth ────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'client' | 'visitor';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  clientId?: string;
  photoURL?: string;
  createdAt: Date;
}

// ─── Projects ───────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  images: string[];
  category: ProjectCategory;
  tags: string[];
  techStack: TechItem[];
  stats: ProjectStat[];
  goals: string[];
  challenge: string;
  solution: string;
  businessImpact: BusinessImpact[];
  lighthouseScores?: LighthouseScores;
  clientReview?: ClientReview;
  liveUrl?: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
}

export type ProjectCategory = 'website' | 'mobile' | 'video' | 'branding' | 'webapp';

export interface TechItem {
  name: string;
  icon?: string;
  color?: string;
}

export interface ProjectStat {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}

export interface BusinessImpact {
  metric: string;
  before: string;
  after: string;
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface ClientReview {
  author: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
  rating: number;
}

// ─── Services ───────────────────────────────────────────────────────────────
export type ServiceSlug = 'website' | 'web-apps' | 'android-apps' | 'ai-videos' | 'blogs';

export interface Service {
  id: string;
  slug: ServiceSlug;
  title: string;
  tagline: string;
  problem: string;
  description: string;
  icon: string;
  features: ServiceFeature[];
  techStack: TechItem[];
  pricing: PricingTier[];
  order: number;
  published: boolean;
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  deliveryWeeks: number;
  popular?: boolean;
}

// ─── Blog ───────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  readingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  resources?: BlogResource[];
  published: boolean;
  publishedAt: Date;
  updatedAt: Date;
}

export interface Author {
  name: string;
  avatar: string;
  role: string;
  bio?: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface BlogResource {
  title: string;
  type: 'pdf' | 'code' | 'figma' | 'link';
  url: string;
}

// ─── Testimonials ───────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  companyLogo?: string;
  avatar?: string;
  quote: string;
  rating: number;
  projectId?: string;
}

// ─── Contact ────────────────────────────────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: ServiceSlug;
  budget?: string;
  message: string;
  files?: string[];
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: Date;
}

// ─── Cursor States ──────────────────────────────────────────────────────────
export type CursorState =
  | 'idle'
  | 'hover-link'
  | 'hover-button'
  | 'hover-image'
  | 'hover-video'
  | 'drag'
  | 'progress'
  | 'page-nav'
  | 'hidden';

// ─── Scene ──────────────────────────────────────────────────────────────────
export type SceneId =
  | 'arrival'
  | 'identity'
  | 'problems'
  | 'process'
  | 'proof'
  | 'numbers'
  | 'voices'
  | 'gallery'
  | 'invitation';

export interface SceneAtmosphere {
  bg: string;
  glowColor: string;
  particleOpacity: number;
  grainOpacity: number;
}

// ─── Command Palette ─────────────────────────────────────────────────────────
export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  href?: string;
  action?: () => void;
  group: 'pages' | 'projects' | 'blog' | 'services' | 'actions';
  keywords?: string[];
}

// ─── i18n ───────────────────────────────────────────────────────────────────
export type Locale = 'en';
export const LOCALES: Locale[] = ['en'];
export const DEFAULT_LOCALE: Locale = 'en';
