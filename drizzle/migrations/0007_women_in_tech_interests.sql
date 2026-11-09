CREATE TABLE public.women_in_tech_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  stage text NOT NULL CHECK (stage IN ('startup','corporate','transition')),
  involvement text[] NOT NULL DEFAULT '{}' CHECK (involvement <@ ARRAY['host_space','speak','organize','sponsor','attend']::text[]),
  note text CHECK (note IS NULL OR char_length(note) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.women_in_tech_interests TO anon, authenticated;
GRANT ALL ON public.women_in_tech_interests TO service_role;
ALTER TABLE public.women_in_tech_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can sign up for women in tech" ON public.women_in_tech_interests FOR INSERT TO anon, authenticated WITH CHECK (true);