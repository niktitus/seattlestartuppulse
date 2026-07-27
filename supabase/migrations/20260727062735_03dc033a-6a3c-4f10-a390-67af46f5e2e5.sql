DO $$
DECLARE
  tok text;
  anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjY254cGllamlwaW5meXF2bXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTM3NjUsImV4cCI6MjA4MTgyOTc2NX0.R47Z-62L_KBD8BM6ov_kdkEerEfE0FixBOEs00HC9hY';
  j record;
BEGIN
  SELECT token INTO tok FROM public.cron_auth WHERE id = 'cron';

  FOR j IN SELECT jobid, jobname, schedule, command FROM cron.job
           WHERE command LIKE '%/functions/v1/scrape-events%'
              OR command LIKE '%/functions/v1/scrape-deadlines%'
              OR command LIKE '%/functions/v1/curate-news%'
  LOOP
    PERFORM cron.unschedule(j.jobname);
  END LOOP;

  PERFORM cron.schedule('scrape-events-daily', '0 13 * * *', format($f$
    SELECT net.http_post(
      url:='https://rccnxpiejipinfyqvmqc.supabase.co/functions/v1/scrape-events',
      headers:=%L::jsonb,
      body:='{}'::jsonb) as request_id;
  $f$, jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||anon,'x-cron-secret',tok)::text));

  PERFORM cron.schedule('scrape-deadlines-weekly', '0 14 * * 1', format($f$
    SELECT net.http_post(
      url:='https://rccnxpiejipinfyqvmqc.supabase.co/functions/v1/scrape-deadlines',
      headers:=%L::jsonb,
      body:='{}'::jsonb) as request_id;
  $f$, jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||anon,'x-cron-secret',tok)::text));

  PERFORM cron.schedule('curate-news-biweekly', '0 14 * * 1,5', format($f$
    SELECT net.http_post(
      url:='https://rccnxpiejipinfyqvmqc.supabase.co/functions/v1/curate-news',
      headers:=%L::jsonb,
      body:='{}'::jsonb) as request_id;
  $f$, jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||anon,'x-cron-secret',tok)::text));
END $$;

DROP FUNCTION IF EXISTS public._tmp_list_cron();