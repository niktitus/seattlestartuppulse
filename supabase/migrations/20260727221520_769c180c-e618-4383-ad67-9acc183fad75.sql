DROP POLICY IF EXISTS "Anonymous visitors can submit event feedback" ON public.event_feedback;

CREATE POLICY "Anonymous visitors can submit event feedback"
ON public.event_feedback
FOR INSERT
TO anon
WITH CHECK (auth.role() = 'anon');