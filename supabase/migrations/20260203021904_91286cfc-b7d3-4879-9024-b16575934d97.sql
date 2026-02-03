-- Create enum types for learning resources
CREATE TYPE public.skill_category AS ENUM ('Fundraising', 'Product', 'Sales', 'Operations', 'Leadership', 'Technical', 'Marketing', 'Legal/Compliance');
CREATE TYPE public.learning_format AS ENUM ('Self-paced', 'Live cohort', 'Workshop', 'Bootcamp', 'Certification program');
CREATE TYPE public.difficulty_level AS ENUM ('Intermediate', 'Advanced', 'Expert');
CREATE TYPE public.time_to_roi AS ENUM ('Apply immediately', 'Long-term skill building');
CREATE TYPE public.price_type AS ENUM ('Free', 'Paid', 'Price on website');

-- Create learning_resources table
CREATE TABLE public.learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Course details
  course_name TEXT NOT NULL,
  course_url TEXT NOT NULL,
  description TEXT,
  
  -- Instructor
  instructor_name TEXT NOT NULL,
  instructor_linkedin TEXT,
  
  -- Categorization
  skill_category skill_category NOT NULL DEFAULT 'Product',
  format learning_format NOT NULL DEFAULT 'Self-paced',
  difficulty difficulty_level NOT NULL DEFAULT 'Intermediate',
  time_to_roi time_to_roi NOT NULL DEFAULT 'Apply immediately',
  
  -- Pricing
  price_type price_type NOT NULL DEFAULT 'Paid',
  price_amount INTEGER, -- in cents
  
  -- Time commitment
  time_commitment TEXT, -- e.g., "4 weeks, 5 hrs/week"
  
  -- Badges/Features
  is_free BOOLEAN GENERATED ALWAYS AS (price_type = 'Free') STORED,
  has_certification BOOLEAN DEFAULT false,
  is_founder_recommended BOOLEAN DEFAULT false,
  
  -- Admin
  is_approved BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved resources
CREATE POLICY "Anyone can view approved learning resources"
ON public.learning_resources
FOR SELECT
USING (is_approved = true);

-- Anyone can submit resources (goes to moderation)
CREATE POLICY "Anyone can submit learning resources"
ON public.learning_resources
FOR INSERT
WITH CHECK (true);

-- Create learning_submissions table for community submissions
CREATE TABLE public.learning_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  submitter_email TEXT NOT NULL,
  submitter_name TEXT,
  
  course_name TEXT NOT NULL,
  course_url TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT NOT NULL,
  instructor_linkedin TEXT,
  skill_category TEXT NOT NULL DEFAULT 'Product',
  format TEXT NOT NULL DEFAULT 'Self-paced',
  difficulty TEXT NOT NULL DEFAULT 'Intermediate',
  time_to_roi TEXT NOT NULL DEFAULT 'Apply immediately',
  price_type TEXT NOT NULL DEFAULT 'Paid',
  price_amount INTEGER,
  time_commitment TEXT,
  has_certification BOOLEAN DEFAULT false,
  
  -- Moderation
  status TEXT DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Enable RLS for submissions
ALTER TABLE public.learning_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit learning suggestions"
ON public.learning_submissions
FOR INSERT
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_learning_resources_category ON public.learning_resources(skill_category);
CREATE INDEX idx_learning_resources_approved ON public.learning_resources(is_approved);

-- Create updated_at trigger
CREATE TRIGGER update_learning_resources_updated_at
BEFORE UPDATE ON public.learning_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();