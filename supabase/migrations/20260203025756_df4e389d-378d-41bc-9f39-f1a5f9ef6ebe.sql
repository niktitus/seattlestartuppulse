-- Create enum for subscriber roles
CREATE TYPE subscriber_role AS ENUM (
  'Founder',
  'Operator',
  'Investor',
  'Service Provider',
  'Accelerator/Incubator',
  'Ecosystem Builder',
  'Other'
);

-- Create digest_subscribers table for newsletter signups
CREATE TABLE public.digest_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  role subscriber_role NOT NULL,
  is_confirmed BOOLEAN NOT NULL DEFAULT false,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source_tab TEXT, -- which tab they signed up from
  source_type TEXT DEFAULT 'bottom_section' -- 'bottom_section', 'exit_intent', 'after_interaction'
);

-- Enable RLS
ALTER TABLE public.digest_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to digest"
ON public.digest_subscribers
FOR INSERT
WITH CHECK (true);

-- Allow anyone to check if email exists (for duplicate handling)
CREATE POLICY "Anyone can check subscription status"
ON public.digest_subscribers
FOR SELECT
USING (true);