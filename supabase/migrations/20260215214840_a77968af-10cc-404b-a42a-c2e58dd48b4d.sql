
-- Fix: Remove overly permissive SELECT on digest_subscribers
DROP POLICY IF EXISTS "Anyone can check subscription status" ON public.digest_subscribers;

-- Only allow checking own email (for duplicate detection via edge function with service role)
-- No public SELECT needed; the signup flow uses upsert which doesn't need SELECT
CREATE POLICY "No public select on digest_subscribers" ON public.digest_subscribers
  FOR SELECT USING (false);

-- Fix: Explicitly block public SELECT on early_access_signups  
CREATE POLICY "No public select on early_access_signups" ON public.early_access_signups
  FOR SELECT USING (false);
