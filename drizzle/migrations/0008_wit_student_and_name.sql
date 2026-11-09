ALTER TABLE public.women_in_tech_interests DROP CONSTRAINT IF EXISTS women_in_tech_interests_stage_check;
ALTER TABLE public.women_in_tech_interests ADD CONSTRAINT women_in_tech_interests_stage_check CHECK (stage IN ('student','startup','corporate','transition'));
ALTER TABLE public.women_in_tech_interests ADD COLUMN name text CHECK (name IS NULL OR char_length(name) <= 120);