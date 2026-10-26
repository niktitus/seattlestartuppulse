CREATE TABLE public.fireside_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  question text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.fireside_questions TO service_role;
ALTER TABLE public.fireside_questions ENABLE ROW LEVEL SECURITY;