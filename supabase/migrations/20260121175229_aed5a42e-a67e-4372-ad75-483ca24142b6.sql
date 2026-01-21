-- Create table for early access signups
CREATE TABLE public.early_access_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  linkedin TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Allow insert from edge function (service role)
CREATE POLICY "Allow insert via service role" 
ON public.early_access_signups 
FOR INSERT 
WITH CHECK (true);

-- Allow select for admin access (will verify via edge function)
CREATE POLICY "Allow select via service role" 
ON public.early_access_signups 
FOR SELECT 
USING (true);