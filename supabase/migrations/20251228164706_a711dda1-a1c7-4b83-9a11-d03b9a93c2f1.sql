-- Create events table for user-submitted and curated events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'inperson',
  audience TEXT[] DEFAULT ARRAY['Founders'],
  stage TEXT[] DEFAULT ARRAY['Pre-seed', 'Seed'],
  type TEXT NOT NULL DEFAULT 'Event',
  organizer TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  city TEXT DEFAULT 'Seattle',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view approved events
CREATE POLICY "Anyone can view approved events"
ON public.events
FOR SELECT
USING (is_approved = true);

-- Allow anyone to insert events (they'll be pending approval)
CREATE POLICY "Anyone can submit events"
ON public.events
FOR INSERT
WITH CHECK (true);

-- Enable realtime for events table
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;