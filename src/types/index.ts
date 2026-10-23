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
