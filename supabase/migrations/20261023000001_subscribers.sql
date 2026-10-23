-- UJADU RURAL DISCIPLESHIP MISSION - Subscribers Schema & RLS Policies
-- Migration for Newsletter Subscribers

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active BOOLEAN NOT NULL DEFAULT true
);

-- Index for subscriber email lookup
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON public.subscribers(subscribed_at DESC);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public to insert newsletter subscriptions
CREATE POLICY "Public can subscribe to newsletter" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (true);

-- Only admins can view subscriber emails
CREATE POLICY "Only admins can view subscribers" 
  ON public.subscribers 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update or delete subscribers
CREATE POLICY "Only admins can update subscribers" 
  ON public.subscribers 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete subscribers" 
  ON public.subscribers 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
