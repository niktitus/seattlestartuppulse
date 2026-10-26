CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL,
  stage text,
  is_mentor boolean NOT NULL DEFAULT false,
  mentor_status text NOT NULL DEFAULT 'none',
  linkedin_url text,
  show_badge_card boolean NOT NULL DEFAULT false,
  short_id text UNIQUE,
  role text,
  company text,
  offer_tags text[],
  badge_tags text[],
  opt_in_partner_share boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.people TO anon, authenticated;
GRANT ALL ON public.people TO service_role;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.vouches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  voucher_name text NOT NULL,
  voucher_contact text NOT NULL,
  token text NOT NULL UNIQUE,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.vouches TO service_role;
ALTER TABLE public.vouches ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  who_they_help text NOT NULL,
  themes text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  action_today text NOT NULL,
  url text NOT NULL,
  contact_name text,
  contact_role text,
  contact_info text,
  contact_public boolean NOT NULL DEFAULT false,
  office_hours text,
  status text NOT NULL DEFAULT 'pending',
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.organizations TO anon, authenticated;
GRANT SELECT ON public.organizations TO anon, authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved organizations" ON public.organizations FOR SELECT TO anon, authenticated USING (status = 'approved');

CREATE TABLE public.interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (person_id, organization_id)
);
GRANT INSERT ON public.interests TO anon, authenticated;
GRANT ALL ON public.interests TO service_role;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  type text NOT NULL,
  other_name text,
  other_email text,
  tags text[] NOT NULL DEFAULT '{}',
  coffee_count integer,
  availability text[],
  neighborhood text,
  linked_commitment_id uuid,
  source text NOT NULL DEFAULT 'qr',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.commitments TO anon, authenticated;
GRANT ALL ON public.commitments TO service_role;
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'proposed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.match_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE
);
GRANT ALL ON public.match_members TO service_role;
ALTER TABLE public.match_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE,
  commitment_id uuid REFERENCES public.commitments(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  stage text NOT NULL,
  response text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.checkins TO service_role;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  match_id uuid REFERENCES public.matches(id) ON DELETE SET NULL,
  redeemed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.vouchers TO service_role;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_badge_card(p_short_id text)
RETURNS TABLE(first_name text, stage text, badge_tags text[], linkedin_url text, is_mentor boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT first_name, stage, badge_tags, linkedin_url, (is_mentor AND mentor_status = 'approved')
  FROM public.people
  WHERE short_id = p_short_id AND show_badge_card = true
$$;
GRANT EXECUTE ON FUNCTION public.get_badge_card(text) TO anon, authenticated;