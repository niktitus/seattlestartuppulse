CREATE TABLE public.track_picks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_name text NOT NULL,
  track_description text,
  event_ids uuid[] NOT NULL DEFAULT '{}',
  week_of date NOT NULL,
  follows integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.track_picks TO anon, authenticated;
GRANT ALL ON public.track_picks TO service_role;
ALTER TABLE public.track_picks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tracks are public" ON public.track_picks FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.showup_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL,
  total_events_tracked integer NOT NULL,
  avg_show_rate numeric(4,3) NOT NULL CHECK (avg_show_rate >= 0 AND avg_show_rate <= 1),
  total_rsvps integer,
  total_attended integer,
  top_format text,
  top_day text,
  busiest_week text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.showup_snapshots TO anon, authenticated;
GRANT ALL ON public.showup_snapshots TO service_role;
ALTER TABLE public.showup_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Snapshots are public" ON public.showup_snapshots FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.forecast_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_title text CHECK (event_title IS NULL OR length(event_title) <= 200),
  format text NOT NULL CHECK (format IN ('Panel','Workshop','Mixer','Fireside','Demo Day','Hackathon','Meetup','Dinner')),
  expected_rsvps integer NOT NULL CHECK (expected_rsvps BETWEEN 1 AND 100000),
  day_of_week text NOT NULL CHECK (day_of_week IN ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  time_of_day text NOT NULL CHECK (time_of_day IN ('Morning','Lunch','After Work','Evening')),
  is_free boolean NOT NULL,
  has_food boolean NOT NULL DEFAULT false,
  has_cohost boolean NOT NULL DEFAULT false,
  competing_events integer NOT NULL DEFAULT 0 CHECK (competing_events BETWEEN 0 AND 50),
  weather_factor text NOT NULL DEFAULT 'normal' CHECK (weather_factor IN ('sunny','normal','rainy')),
  predicted_attendees integer NOT NULL,
  predicted_show_rate numeric(4,3) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.forecast_logs TO anon, authenticated;
GRANT ALL ON public.forecast_logs TO service_role;
ALTER TABLE public.forecast_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can save a forecast" ON public.forecast_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.event_lifecycle (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
  phase text NOT NULL DEFAULT 'before' CHECK (phase IN ('before','during','after')),
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','completed')),
  pre_event_notes text,
  live_pulse text,
  post_event_summary text,
  rsvps integer,
  attended integer,
  show_rate numeric(4,3),
  connections_made integer,
  top_ask text,
  top_offer text,
  lessons text,
  edit_token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT (id, event_id, phase, status, pre_event_notes, live_pulse, post_event_summary, rsvps, attended, show_rate, connections_made, top_ask, top_offer, lessons, created_at, updated_at) ON public.event_lifecycle TO anon, authenticated;
GRANT ALL ON public.event_lifecycle TO service_role;
ALTER TABLE public.event_lifecycle ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lifecycle is public" ON public.event_lifecycle FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.pulse_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme text NOT NULL CHECK (length(theme) BETWEEN 3 AND 280),
  source text NOT NULL DEFAULT 'submitted' CHECK (source IN ('submitted','event_feedback','editorial')),
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  upvotes integer NOT NULL DEFAULT 0,
  is_hidden boolean NOT NULL DEFAULT false,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pulse_themes TO anon, authenticated;
GRANT ALL ON public.pulse_themes TO service_role;
ALTER TABLE public.pulse_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible pulse is public" ON public.pulse_themes FOR SELECT TO anon, authenticated USING (is_hidden = false);