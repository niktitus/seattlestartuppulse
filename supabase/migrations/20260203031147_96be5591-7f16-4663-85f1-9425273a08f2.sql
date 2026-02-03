-- Fix early_access_signups: Remove public SELECT policy
-- Only admins should read this data via edge function with service role
DROP POLICY IF EXISTS "Allow select via service role" ON public.early_access_signups;

-- Fix learning_submissions: Add explicit restrictive SELECT policy (currently has none)
-- This table should only be readable by admins via service role
-- (No action needed - already restricted. But let's ensure no future policy adds public access)
COMMENT ON TABLE public.learning_submissions IS 'Submitter data is private. Only admin access via service role.';