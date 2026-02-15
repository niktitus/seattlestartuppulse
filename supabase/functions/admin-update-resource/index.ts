import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Allowed fields per table
const TABLE_FIELDS: Record<string, Set<string>> = {
  events: new Set([
    'title', 'date', 'time', 'format', 'type', 'organizer', 'description', 'url',
    'audience', 'stage', 'featured', 'is_approved', 'is_high_signal',
    'city', 'host_type', 'cost', 'expected_size', 'outcome_framing',
    'registration_deadline', 'spots_available',
  ]),
  learning_resources: new Set([
    'course_name', 'course_url', 'description', 'instructor_name', 'instructor_linkedin',
    'skill_category', 'format', 'difficulty', 'time_to_roi', 'price_type', 'price_amount',
    'is_free', 'has_certification', 'is_founder_recommended', 'is_approved', 'time_commitment',
  ]),
  startup_jobs: new Set([
    'job_title', 'company_name', 'company_url', 'company_address', 'founder_name',
    'founder_linkedin', 'funding_stage', 'department', 'work_model', 'salary_type',
    'salary_min', 'salary_max', 'equity_min', 'equity_max', 'application_url',
    'description', 'is_approved', 'is_expired',
  ]),
  news: new Set([
    'title', 'source', 'date', 'summary', 'url', 'category', 'is_approved',
  ]),
  deadlines: new Set([
    'title', 'due_date', 'days_left', 'type', 'description', 'url', 'is_approved',
  ]),
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`admin-update:${ip}`, 100, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  try {
    const authResult = await verifyAdminToken(req.headers.get('Authorization'));
    if (!authResult.valid) {
      return new Response(
        JSON.stringify({ success: false, error: authResult.error }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { table, id, updates, action } = await req.json();

    if (!table || !TABLE_FIELDS[table]) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid table. Allowed: ${Object.keys(TABLE_FIELDS).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Resource ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle delete
    if (action === 'delete') {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle update
    if (!updates || typeof updates !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Updates object required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allowedFields = TABLE_FIELDS[table];
    const sanitizedUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.has(key)) {
        sanitizedUpdates[key] = value;
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No valid fields to update' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from(table)
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-update-resource:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
