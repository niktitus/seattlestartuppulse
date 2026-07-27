import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Verifies a scheduled (cron) invocation using a private token stored in the
 * database (public.cron_auth), readable only with the service role.
 * The public anon key is NOT accepted as proof of a cron call.
 */
export async function isCronRequest(req: Request): Promise<boolean> {
  const provided = req.headers.get('x-cron-secret');
  if (!provided) return false;

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data, error } = await supabase
      .from('cron_auth')
      .select('token')
      .eq('id', 'cron')
      .maybeSingle();

    if (error || !data?.token) return false;

    const enc = new TextEncoder();
    const a = enc.encode(provided);
    const b = enc.encode(data.token);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  } catch (_e) {
    return false;
  }
}