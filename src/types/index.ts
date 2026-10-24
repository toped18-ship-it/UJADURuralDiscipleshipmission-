export type UserRole = 'member' | 'admin';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'Evangelism' | 'Rural Outreach' | 'Bible Study' | 'Discipleship' | 'Prayer Meetings' | 'Mission Events';
  storage_path: string;
  alt_text: string;
  published: boolean;
  event_date: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface AudioTeaching {
  id: string;
  title: string;
  speaker: string;
  description: string;
  category: 'Sermon' | 'Discipleship Series' | 'Evangelism' | 'Devotionals' | 'Prayer' | 'Leadership';
  scripture_reference: string;
  audio_storage_path: string;
  audio_file_id?: string;
  cover_storage_path?: string;
  duration_seconds: number;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_path: string;
  author_id?: string;
  author_name: string;
  category: 'Bible Teachings' | 'Discipleship' | 'Devotionals' | 'Evangelism' | 'Mission Reports' | 'Testimonies' | 'Ministry News';
  tags: string[];
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  ministry_name: string;
  logo_text: string;
  tagline: string;
  hero_headline: string;
  hero_subtext: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  mission_statement: string;
  vision_statement: string;
  core_values: string[];
  footer_text: string;
  seo_title: string;
  seo_description: string;
  social_facebook?: string;
  social_youtube?: string;
  social_whatsapp?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  partnership_type: 'general' | 'prayer' | 'volunteer' | 'discipleship' | 'outreach_support';
  message: string;
  created_at: string;
  read: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

export interface CustomPageSlide {
  id: string;
  image_url: string;
  title?: string;
  caption?: string;
}

export interface CustomPageGalleryItem {
  id: string;
  image_url: string;
  caption?: string;
}

export interface CustomPageSection {
  id: string;
  heading: string;
  content: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  hero_image?: string;
  content: string;
  sections?: CustomPageSection[];
  slides?: CustomPageSlide[];
  auto_play_slides?: boolean;
  slide_interval_seconds?: number;
  gallery?: CustomPageGalleryItem[];
  audio_title?: string;
  audio_speaker?: string;
  audio_storage_path?: string;
  audio_file_id?: string;
  audio_duration?: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  publishedBlogs: number;
  draftBlogs: number;
  publishedGallery: number;
  publishedAudio: number;
  totalMessages: number;
  totalSubscribers: number;
  customPages?: number;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url?: string;
  initials?: string;
}

export interface CorePillar {
  id: string;
  title: string;
  scripture_reference?: string;
  description: string;
}

export interface DiscipleshipCyclePhase {
  id: string;
  step_number: number;
  title: string;
  description: string;
}

export interface AboutMilestoneStat {
  id: string;
  value: string;
  label: string;
}

export interface AboutContent {
  // Hero Section
  hero_badge: string;
  hero_title: string;
  hero_tagline: string;

  // Overview / Calling Section
  overview_badge: string;
  overview_title: string;
  overview_paragraph_1: string;
  overview_paragraph_2: string;
  overview_image: string;
  overview_image_alt: string;

  // Mission & Vision
  mission_title: string;
  mission_statement: string;
  vision_title: string;
  vision_statement: string;

  // Core Pillars / Biblical Values
  pillars_badge: string;
  pillars_title: string;
  pillars_subtext: string;
  pillars: CorePillar[];

  // 4-Phase Discipleship Cycle / Strategy
  strategy_badge: string;
  strategy_title: string;
  strategy_phases: DiscipleshipCyclePhase[];

  // Leadership Team
  leadership_badge: string;
  leadership_title: string;
  leadership_subtext: string;
  leadership_team: LeadershipMember[];

  // Milestones / Stats (impact counters)
  milestones_title?: string;
  milestones: AboutMilestoneStat[];

  // Call to Action
  cta_heading: string;
  cta_primary_label: string;
  cta_primary_link: string;
  cta_secondary_label: string;
  cta_secondary_link: string;

  updated_at?: string;
}

