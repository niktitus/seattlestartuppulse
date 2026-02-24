
-- Create resource_links table for all curated resource links
CREATE TABLE public.resource_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Communities',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;

-- Public can view approved resources
CREATE POLICY "Anyone can view approved resource links"
ON public.resource_links
FOR SELECT
USING (is_approved = true);

-- Create trigger for updated_at
CREATE TRIGGER update_resource_links_updated_at
BEFORE UPDATE ON public.resource_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
