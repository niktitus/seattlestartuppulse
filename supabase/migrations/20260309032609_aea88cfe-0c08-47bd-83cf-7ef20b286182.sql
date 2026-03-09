-- Remove old daily deadlines cron job
SELECT cron.unschedule('scrape-deadlines-daily');

-- Schedule deadlines weekly (Monday 6am PT = 14:00 UTC)
SELECT cron.schedule(
  'scrape-deadlines-weekly',
  '0 14 * * 1',
  $$
  SELECT net.http_post(
    url:='https://rccnxpiejipinfyqvmqc.supabase.co/functions/v1/scrape-deadlines',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjY254cGllamlwaW5meXF2bXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTM3NjUsImV4cCI6MjA4MTgyOTc2NX0.R47Z-62L_KBD8BM6ov_kdkEerEfE0FixBOEs00HC9hY"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);

-- Schedule news curation Mon and Fri 6am PT = 14:00 UTC
SELECT cron.schedule(
  'curate-news-biweekly',
  '0 14 * * 1,5',
  $$
  SELECT net.http_post(
    url:='https://rccnxpiejipinfyqvmqc.supabase.co/functions/v1/curate-news',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjY254cGllamlwaW5meXF2bXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTM3NjUsImV4cCI6MjA4MTgyOTc2NX0.R47Z-62L_KBD8BM6ov_kdkEerEfE0FixBOEs00HC9hY"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);