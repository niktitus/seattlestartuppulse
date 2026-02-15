import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get or create JWT secret key
async function getJwtKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('ADMIN_PASSWORD')!;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.padEnd(32, '0').slice(0, 32));
  
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`verify-admin:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  try {
    const { password } = await req.json();
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password === adminPassword) {
      console.log('Admin authentication successful');
      
      const key = await getJwtKey();
      const token = await create(
        { alg: "HS256", typ: "JWT" },
        { 
          role: "admin",
          exp: getNumericDate(60 * 60),
          iat: getNumericDate(0)
        },
        key
      );
      
      return new Response(
        JSON.stringify({ success: true, token }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log('Admin authentication failed - incorrect password');
      return new Response(
        JSON.stringify({ success: false, error: 'Incorrect password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error verifying admin:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to verify password' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
