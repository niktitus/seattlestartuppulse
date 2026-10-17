ALTER TABLE public.void_shouts ALTER COLUMN arena DROP NOT NULL;
COMMENT ON COLUMN public.void_shouts.arena IS 'DEPRECATED: the arena question was removed on 2026-10-17 and is no longer collected; kept only for rows saved before then.';
DROP VIEW IF EXISTS public.void_theme_counts;
DROP FUNCTION IF EXISTS public.get_safe_void_counts();
CREATE FUNCTION public.get_safe_void_counts()
RETURNS TABLE(theme text, month date, count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
 SELECT t.theme, date_trunc('month', s.created_on)::date, count(DISTINCT s.id)
 FROM public.void_shouts s CROSS JOIN LATERAL unnest(s.themes) t(theme)
 WHERE s.status <> 'hidden' AND NOT s.needs_review
 GROUP BY t.theme, date_trunc('month', s.created_on)::date
 HAVING count(DISTINCT s.id) >= 5
$$;
REVOKE ALL ON FUNCTION public.get_safe_void_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_safe_void_counts() TO anon, authenticated, service_role;
CREATE VIEW public.void_theme_counts WITH (security_invoker = true) AS SELECT * FROM public.get_safe_void_counts();
GRANT SELECT ON public.void_theme_counts TO anon, authenticated, service_role;