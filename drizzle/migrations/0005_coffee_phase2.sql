ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'match';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS shared_tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS reason text;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS other_name text;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE public.match_members ADD COLUMN IF NOT EXISTS commitment_id uuid REFERENCES public.commitments(id) ON DELETE SET NULL;
ALTER TABLE public.vouchers ADD COLUMN IF NOT EXISTS person_id uuid REFERENCES public.people(id) ON DELETE SET NULL;
ALTER TABLE public.checkins ADD COLUMN IF NOT EXISTS token text UNIQUE;
ALTER TABLE public.checkins ADD COLUMN IF NOT EXISTS sent_at timestamptz;
ALTER TABLE public.checkins ADD COLUMN IF NOT EXISTS responded_at timestamptz;
ALTER TABLE public.checkins ADD COLUMN IF NOT EXISTS handled_at timestamptz;

CREATE TABLE public.outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
  match_id uuid REFERENCES public.matches(id) ON DELETE SET NULL,
  checkin_id uuid REFERENCES public.checkins(id) ON DELETE SET NULL,
  kind text NOT NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.outbox TO service_role;
ALTER TABLE public.outbox ENABLE ROW LEVEL SECURITY;