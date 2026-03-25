
CREATE TABLE public.startup_directory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT '',
  description TEXT,
  is_approved BOOLEAN DEFAULT false
);

ALTER TABLE public.startup_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved directory entries"
  ON public.startup_directory FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Anyone can submit directory entries"
  ON public.startup_directory FOR INSERT
  TO public
  WITH CHECK (true);

CREATE TRIGGER update_startup_directory_updated_at
  BEFORE UPDATE ON public.startup_directory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
