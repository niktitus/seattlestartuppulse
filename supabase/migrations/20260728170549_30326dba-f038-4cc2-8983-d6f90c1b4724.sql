ALTER TABLE public.event_feedback
  ADD COLUMN IF NOT EXISTS interested_banking boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS interested_sponsors text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS contact_first_name text,
  ADD COLUMN IF NOT EXISTS contact_last_name text,
  ADD COLUMN IF NOT EXISTS contact_email text;