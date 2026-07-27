CREATE OR REPLACE FUNCTION public._tmp_list_cron()
RETURNS TABLE(jobid bigint, jobname text, schedule text, command text)
LANGUAGE sql SECURITY DEFINER SET search_path = public, cron
AS $$ SELECT j.jobid, j.jobname, j.schedule, j.command FROM cron.job j $$;
GRANT EXECUTE ON FUNCTION public._tmp_list_cron() TO service_role, authenticated;