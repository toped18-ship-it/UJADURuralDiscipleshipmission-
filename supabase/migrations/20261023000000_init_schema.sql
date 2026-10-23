-- UJADU RURAL DISCIPLESHIP MISSION - Initial Database Schema & RLS Policies
-- PostgreSQL Migration for Supabase

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- 3. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General Outreach',
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  event_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- 4. AUDIO TEACHINGS TABLE
CREATE TABLE IF NOT EXISTS public.audio_teachings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  speaker TEXT NOT NULL DEFAULT 'UJADU Mission Preacher',
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Discipleship',
  scripture_reference TEXT,
  audio_storage_path TEXT NOT NULL,
  cover_storage_path TEXT,
  duration_seconds INTEGER,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- 5. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_path TEXT,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT NOT NULL DEFAULT 'UJADU Discipleship Team',
  category TEXT NOT NULL DEFAULT 'Discipleship',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery_images(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_audio_published ON public.audio_teachings(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_audio_category ON public.audio_teachings(category);
CREATE INDEX IF NOT EXISTS idx_blog_status_slug ON public.blog_posts(status, slug);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON public.blog_posts(published_at DESC);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_update_gallery_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_update_audio_updated_at BEFORE UPDATE ON public.audio_teachings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_update_blog_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_teachings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Helper function to check if authenticated user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile except role" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. SITE SETTINGS POLICIES
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify site settings" ON public.site_settings FOR ALL USING (is_admin());

-- 3. GALLERY IMAGES POLICIES
CREATE POLICY "Public can view published gallery images" ON public.gallery_images FOR SELECT USING (published = true OR is_admin());
CREATE POLICY "Admins can insert gallery images" ON public.gallery_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update gallery images" ON public.gallery_images FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete gallery images" ON public.gallery_images FOR DELETE USING (is_admin());

-- 4. AUDIO TEACHINGS POLICIES
CREATE POLICY "Public can view published audio teachings" ON public.audio_teachings FOR SELECT USING (published = true OR is_admin());
CREATE POLICY "Admins can insert audio teachings" ON public.audio_teachings FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update audio teachings" ON public.audio_teachings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete audio teachings" ON public.audio_teachings FOR DELETE USING (is_admin());

-- 5. BLOG POSTS POLICIES
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE USING (is_admin());

-- STORAGE BUCKET CREATION (Supabase Storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-teachings', 'audio-teachings', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('branding-assets', 'branding-assets', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Read Access Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Admin Upload Gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND is_admin());
CREATE POLICY "Admin Delete Gallery" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images' AND is_admin());

CREATE POLICY "Public Read Access Audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio-teachings');
CREATE POLICY "Admin Upload Audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio-teachings' AND is_admin());
CREATE POLICY "Admin Delete Audio" ON storage.objects FOR DELETE USING (bucket_id = 'audio-teachings' AND is_admin());

CREATE POLICY "Public Read Access Blog Images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Admin Upload Blog Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND is_admin());
CREATE POLICY "Admin Delete Blog Images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND is_admin());
