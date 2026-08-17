CREATE TABLE public.sponsorship_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  audience_type TEXT NOT NULL CHECK (audience_type IN ('organizer','brand')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.sponsorship_waitlist TO anon, authenticated;
GRANT ALL ON public.sponsorship_waitlist TO service_role;

ALTER TABLE public.sponsorship_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the sponsorship waitlist"
ON public.sponsorship_waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (organization IS NULL OR length(organization) <= 200)
);