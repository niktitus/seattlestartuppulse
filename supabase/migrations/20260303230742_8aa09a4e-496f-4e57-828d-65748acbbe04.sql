
-- Create deadline_sources table
CREATE TABLE public.deadline_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  platform text NOT NULL DEFAULT 'generic',
  is_active boolean NOT NULL DEFAULT true,
  last_scraped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.deadline_sources ENABLE ROW LEVEL SECURITY;

-- Insert the 3 deadline sources
INSERT INTO public.deadline_sources (name, url) VALUES
  ('Amber Grants for Women', 'https://ambergrantsforwomen.com/get-an-amber-grant/'),
  ('Women Founders Grant', 'https://womenfoundersgrant.com/'),
  ('Visionaries Helen Grant', 'https://visionaries.co/helen-grant/');
