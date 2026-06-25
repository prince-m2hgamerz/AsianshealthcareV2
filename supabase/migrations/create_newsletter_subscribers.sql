-- Run this SQL in your Supabase SQL Editor to create the newsletter_subscribers table
-- Go to: Supabase Dashboard > SQL Editor > New Query > Paste this > Run

-- Create the newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role can do everything" ON public.newsletter_subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow anon users to insert (for newsletter signup from frontend)
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.newsletter_subscribers TO service_role;
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;

-- Verify the table was created
SELECT 'newsletter_subscribers table created successfully!' AS status;
