import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { error } = await supabase
      .from('digest_subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', email)
      .is('unsubscribed_at', null);

    if (error) {
      console.error('Unsubscribe error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to unsubscribe' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return a simple HTML confirmation page
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Unsubscribed — Seattle Startup Pulse</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Calibri,Arial,sans-serif;">
  <div style="max-width:500px;margin:80px auto;background:#fff;padding:48px 32px;border-radius:8px;text-align:center;">
    <h1 style="color:#1a1a1a;font-size:22px;margin:0 0 12px;">You've been unsubscribed</h1>
    <p style="color:#666;font-size:15px;margin:0 0 24px;">You will no longer receive the Seattle Startup Pulse digest.</p>
    <a href="https://seattlestartuppulse.lovable.app" style="color:#2563eb;font-size:14px;">← Back to Seattle Startup Pulse</a>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
