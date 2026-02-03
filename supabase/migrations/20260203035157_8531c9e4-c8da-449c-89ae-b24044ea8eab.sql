-- Add new fields for enhanced event curation
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS cost TEXT DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS expected_size TEXT DEFAULT '25-50',
ADD COLUMN IF NOT EXISTS outcome_framing TEXT,
ADD COLUMN IF NOT EXISTS host_type TEXT DEFAULT 'Community/Independent',
ADD COLUMN IF NOT EXISTS is_high_signal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS spots_available INTEGER;

-- Add check constraint for expected_size values
ALTER TABLE public.events
ADD CONSTRAINT events_expected_size_check 
CHECK (expected_size IN ('10-25', '25-50', '50-100', '100+'));

-- Add check constraint for host_type values
ALTER TABLE public.events
ADD CONSTRAINT events_host_type_check 
CHECK (host_type IN ('VC Firms', 'Accelerators/Incubators', 'Corporate', 'Community/Independent'));