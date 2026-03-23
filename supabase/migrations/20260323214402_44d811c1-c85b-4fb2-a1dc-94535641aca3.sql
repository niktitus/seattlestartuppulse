
CREATE TABLE public.digest_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_at timestamptz NOT NULL DEFAULT now(),
  total_subscribers integer NOT NULL DEFAULT 0,
  total_sent integer NOT NULL DEFAULT 0,
  errors jsonb,
  triggered_by text
);

ALTER TABLE public.digest_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public select on digest_send_log"
  ON public.digest_send_log
  FOR SELECT
  TO public
  USING (false);
