CREATE TABLE public.event_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  most_valuable_part text NOT NULL,
  wish_more text,
  attend_again boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.event_feedback TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_feedback TO authenticated;
GRANT ALL ON public.event_feedback TO service_role;

ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous visitors can submit event feedback"
ON public.event_feedback
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated users can view event feedback"
ON public.event_feedback
FOR SELECT
TO authenticated
USING (true);