-- Create function to update timestamps first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enum types for job fields
CREATE TYPE public.funding_stage AS ENUM ('Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Bootstrapped');
CREATE TYPE public.department AS ENUM ('Engineering', 'Product', 'Sales', 'Marketing', 'Operations', 'Design', 'Data', 'Finance', 'Legal', 'General Management');
CREATE TYPE public.work_model AS ENUM ('Remote', 'Hybrid', 'In-office', 'Remote-first');
CREATE TYPE public.salary_type AS ENUM ('Range', 'Equity-heavy', 'Competitive', 'TBD');

-- Create startup_jobs table
CREATE TABLE public.startup_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_url TEXT,
  company_address TEXT,
  founder_name TEXT,
  founder_linkedin TEXT,
  funding_stage funding_stage NOT NULL DEFAULT 'Seed',
  department department NOT NULL DEFAULT 'Engineering',
  work_model work_model NOT NULL DEFAULT 'Hybrid',
  application_url TEXT NOT NULL,
  salary_type salary_type NOT NULL DEFAULT 'TBD',
  salary_min INTEGER,
  salary_max INTEGER,
  equity_min DECIMAL(5,3),
  equity_max DECIMAL(5,3),
  description TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_expired BOOLEAN DEFAULT false,
  renewal_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.startup_jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved, non-expired jobs
CREATE POLICY "Anyone can view active jobs"
ON public.startup_jobs
FOR SELECT
USING (is_approved = true AND is_expired = false AND expires_at > now());

-- Anyone can submit jobs (goes to moderation)
CREATE POLICY "Anyone can submit jobs"
ON public.startup_jobs
FOR INSERT
WITH CHECK (true);

-- Create job_submissions table for community submissions
CREATE TABLE public.job_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitter_email TEXT NOT NULL,
  submitter_name TEXT,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_url TEXT,
  company_address TEXT,
  founder_name TEXT,
  founder_linkedin TEXT,
  funding_stage TEXT NOT NULL DEFAULT 'Seed',
  department TEXT NOT NULL DEFAULT 'Engineering',
  work_model TEXT NOT NULL DEFAULT 'Hybrid',
  application_url TEXT NOT NULL,
  salary_type TEXT NOT NULL DEFAULT 'TBD',
  salary_min INTEGER,
  salary_max INTEGER,
  equity_min DECIMAL(5,3),
  equity_max DECIMAL(5,3),
  description TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Enable RLS for submissions
ALTER TABLE public.job_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit job listings"
ON public.job_submissions
FOR INSERT
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_startup_jobs_expires_at ON public.startup_jobs(expires_at);
CREATE INDEX idx_startup_jobs_approved ON public.startup_jobs(is_approved, is_expired);

-- Create updated_at trigger
CREATE TRIGGER update_startup_jobs_updated_at
BEFORE UPDATE ON public.startup_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();