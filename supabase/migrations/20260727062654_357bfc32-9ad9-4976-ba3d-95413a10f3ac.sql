-- 1. Internal cron auth token (service-role only)
CREATE TABLE IF NOT EXISTS public.cron_auth (
  id text PRIMARY KEY,
  token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.cron_auth TO service_role;
ALTER TABLE public.cron_auth ENABLE ROW LEVEL SECURITY;
INSERT INTO public.cron_auth (id) VALUES ('cron') ON CONFLICT (id) DO NOTHING;

-- 2. Explicit deny of public reads on submission tables
DROP POLICY IF EXISTS "No public select on job_submissions" ON public.job_submissions;
CREATE POLICY "No public select on job_submissions"
  ON public.job_submissions FOR SELECT USING (false);

DROP POLICY IF EXISTS "No public select on learning_submissions" ON public.learning_submissions;
CREATE POLICY "No public select on learning_submissions"
  ON public.learning_submissions FOR SELECT USING (false);

-- 3. Replace permissive WITH CHECK (true) insert policies with validated ones
DROP POLICY IF EXISTS "Anyone can submit job listings" ON public.job_submissions;
CREATE POLICY "Anyone can submit job listings"
  ON public.job_submissions FOR INSERT
  WITH CHECK (
    (status IS NULL OR status = 'pending')
    AND admin_notes IS NULL
    AND reviewed_at IS NULL
    AND submitter_email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AND length(submitter_email) <= 255
    AND length(job_title) BETWEEN 2 AND 200
    AND length(company_name) BETWEEN 1 AND 200
    AND application_url ~* '^https?://' AND length(application_url) <= 2000
    AND (company_url IS NULL OR (company_url ~* '^https?://' AND length(company_url) <= 2000))
    AND (founder_linkedin IS NULL OR (founder_linkedin ~* '^https?://' AND length(founder_linkedin) <= 2000))
    AND (submitter_name IS NULL OR length(submitter_name) <= 120)
    AND (founder_name IS NULL OR length(founder_name) <= 120)
    AND (company_address IS NULL OR length(company_address) <= 300)
    AND (description IS NULL OR length(description) <= 5000)
    AND (salary_min IS NULL OR salary_min BETWEEN 0 AND 10000000)
    AND (salary_max IS NULL OR salary_max BETWEEN 0 AND 10000000)
    AND (equity_min IS NULL OR equity_min BETWEEN 0 AND 100)
    AND (equity_max IS NULL OR equity_max BETWEEN 0 AND 100)
  );

DROP POLICY IF EXISTS "Anyone can submit learning suggestions" ON public.learning_submissions;
CREATE POLICY "Anyone can submit learning suggestions"
  ON public.learning_submissions FOR INSERT
  WITH CHECK (
    (status IS NULL OR status = 'pending')
    AND admin_notes IS NULL
    AND reviewed_at IS NULL
    AND submitter_email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AND length(submitter_email) <= 255
    AND (submitter_name IS NULL OR length(submitter_name) <= 120)
    AND length(course_name) BETWEEN 2 AND 200
    AND course_url ~* '^https?://' AND length(course_url) <= 2000
    AND (instructor_linkedin IS NULL OR (instructor_linkedin ~* '^https?://' AND length(instructor_linkedin) <= 2000))
    AND length(instructor_name) BETWEEN 1 AND 150
    AND (description IS NULL OR length(description) <= 5000)
    AND (time_commitment IS NULL OR length(time_commitment) <= 100)
    AND (price_amount IS NULL OR price_amount BETWEEN 0 AND 100000000)
  );

DROP POLICY IF EXISTS "Anyone can submit learning resources" ON public.learning_resources;
CREATE POLICY "Anyone can submit learning resources"
  ON public.learning_resources FOR INSERT
  WITH CHECK (
    is_approved IS NOT TRUE
    AND length(course_name) BETWEEN 2 AND 200
    AND course_url ~* '^https?://' AND length(course_url) <= 2000
    AND length(instructor_name) BETWEEN 1 AND 150
    AND (description IS NULL OR length(description) <= 5000)
    AND (price_amount IS NULL OR price_amount BETWEEN 0 AND 100000000)
  );

DROP POLICY IF EXISTS "Anyone can submit directory entries" ON public.startup_directory;
CREATE POLICY "Anyone can submit directory entries"
  ON public.startup_directory FOR INSERT
  WITH CHECK (
    is_approved IS NOT TRUE
    AND length(name) BETWEEN 1 AND 200
    AND website ~* '^https?://' AND length(website) <= 500
    AND length(purpose) <= 100
    AND (description IS NULL OR length(description) <= 1000)
  );

DROP POLICY IF EXISTS "Anyone can submit events" ON public.events;
CREATE POLICY "Anyone can submit events"
  ON public.events FOR INSERT
  WITH CHECK (
    is_approved IS NOT TRUE
    AND length(title) BETWEEN 2 AND 300
    AND url ~* '^https?://' AND length(url) <= 2000
    AND length(description) <= 5000
    AND length(organizer) <= 200
    AND length(date) <= 100
    AND length(time) <= 100
    AND (city IS NULL OR length(city) <= 100)
  );

DROP POLICY IF EXISTS "Anyone can submit news" ON public.news;
CREATE POLICY "Anyone can submit news"
  ON public.news FOR INSERT
  WITH CHECK (
    is_approved IS NOT TRUE
    AND length(title) BETWEEN 2 AND 300
    AND url ~* '^https?://' AND length(url) <= 2000
    AND length(summary) <= 5000
    AND length(source) <= 200
  );

DROP POLICY IF EXISTS "Anyone can submit deadlines" ON public.deadlines;
CREATE POLICY "Anyone can submit deadlines"
  ON public.deadlines FOR INSERT
  WITH CHECK (
    is_approved IS NOT TRUE
    AND length(title) BETWEEN 2 AND 300
    AND url ~* '^https?://' AND length(url) <= 2000
    AND length(description) <= 5000
  );

DROP POLICY IF EXISTS "Anyone can submit jobs" ON public.startup_jobs;
CREATE POLICY "Anyone can submit jobs"
  ON public.startup_jobs FOR INSERT
  WITH CHECK (
    is_approved IS NOT TRUE
    AND length(job_title) BETWEEN 2 AND 200
    AND length(company_name) BETWEEN 1 AND 200
    AND application_url ~* '^https?://' AND length(application_url) <= 2000
    AND (company_url IS NULL OR (company_url ~* '^https?://' AND length(company_url) <= 2000))
    AND (founder_linkedin IS NULL OR (founder_linkedin ~* '^https?://' AND length(founder_linkedin) <= 2000))
    AND (description IS NULL OR length(description) <= 5000)
    AND (salary_min IS NULL OR salary_min BETWEEN 0 AND 10000000)
    AND (salary_max IS NULL OR salary_max BETWEEN 0 AND 10000000)
  );

DROP POLICY IF EXISTS "Anyone can subscribe to digest" ON public.digest_subscribers;
CREATE POLICY "Anyone can subscribe to digest"
  ON public.digest_subscribers FOR INSERT
  WITH CHECK (
    email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AND length(email) <= 255
    AND (source_tab IS NULL OR length(source_tab) <= 100)
    AND (source_type IS NULL OR length(source_type) <= 100)
  );

DROP POLICY IF EXISTS "Allow insert via service role" ON public.early_access_signups;
CREATE POLICY "Allow insert via service role"
  ON public.early_access_signups FOR INSERT
  WITH CHECK (
    email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AND length(email) <= 255
    AND length(first_name) BETWEEN 1 AND 100
    AND length(last_name) BETWEEN 1 AND 100
    AND (linkedin IS NULL OR (linkedin ~* '^https?://' AND length(linkedin) <= 500))
  );