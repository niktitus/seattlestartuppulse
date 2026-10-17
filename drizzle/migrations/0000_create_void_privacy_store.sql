CREATE TABLE public.void_shouts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_on date NOT NULL DEFAULT ((now() AT TIME ZONE 'America/Los_Angeles')::date),
 arena text NOT NULL CHECK (arena IN ('startup','enterprise','both')),
 text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 1500),
 loudness integer NOT NULL CHECK (loudness BETWEEN 1 AND 5),
 role text CHECK (role IN ('Founder','Employee at a startup','Employee at a big company','Between roles','Investor','Other')),
 seattle_tenure text CHECK (seattle_tenure IN ('Under 2','2–5','5–10','10+')),
 quote_ok boolean NOT NULL DEFAULT false,
 themes text[] NOT NULL DEFAULT '{}',
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','hidden')),
 needs_review boolean NOT NULL DEFAULT true
);
GRANT ALL ON public.void_shouts TO service_role;
REVOKE ALL ON public.void_shouts FROM anon, authenticated;
ALTER TABLE public.void_shouts ENABLE ROW LEVEL SECURITY;
CREATE INDEX void_shouts_month_arena ON public.void_shouts (created_on, arena);
CREATE FUNCTION public.get_safe_void_counts()
RETURNS TABLE(theme text, arena text, month date, count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
 SELECT t.theme, s.arena, date_trunc('month', s.created_on)::date, count(DISTINCT s.id)
 FROM public.void_shouts s CROSS JOIN LATERAL unnest(s.themes) t(theme)
 WHERE s.status <> 'hidden' AND NOT s.needs_review
 GROUP BY t.theme, s.arena, date_trunc('month', s.created_on)::date
 HAVING count(DISTINCT s.id) >= 5
$$;
REVOKE ALL ON FUNCTION public.get_safe_void_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_safe_void_counts() TO anon, authenticated, service_role;
CREATE VIEW public.void_theme_counts WITH (security_invoker = true) AS SELECT * FROM public.get_safe_void_counts();
GRANT SELECT ON public.void_theme_counts TO anon, authenticated, service_role;
CREATE TABLE public.void_ai_state (
 id text PRIMARY KEY DEFAULT 'classifier', paused boolean NOT NULL DEFAULT false,
 message text, http_status integer
);
GRANT ALL ON public.void_ai_state TO service_role;
REVOKE ALL ON public.void_ai_state FROM anon, authenticated;
ALTER TABLE public.void_ai_state ENABLE ROW LEVEL SECURITY;