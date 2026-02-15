import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SuggestionRequest {
  name: string;
  email: string;
  suggestionType: string;
  title: string;
  description: string;
  url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit: 3 submissions per IP per hour
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`send-suggestion:${ip}`, 3, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(corsHeaders);

  try {
    const { name, email, suggestionType, title, description, url }: SuggestionRequest = await req.json();

    if (!name || !email || !suggestionType || !title || !description) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate URL format if provided
    if (url && !/^https?:\/\//.test(url)) {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // HTML-escape all user inputs to prevent XSS
    function escapeHtml(unsafe: string): string {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    const emailHtml = `
      <h1>New Suggestion Submitted</h1>
      <h2>Submitter Details</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
      </ul>
      <h2>Suggestion Details</h2>
      <ul>
        <li><strong>Type:</strong> ${escapeHtml(suggestionType)}</li>
        <li><strong>Title:</strong> ${escapeHtml(title)}</li>
        <li><strong>Description:</strong> ${escapeHtml(description)}</li>
        ${url ? `<li><strong>URL:</strong> ${escapeHtml(url)}</li>` : ''}
      </ul>
      <hr />
      <p style="color: #666; font-size: 12px;">
        Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST
      </p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Seattle Startup Pulse <onboarding@resend.dev>",
        to: ["nicoletitus265@gmail.com"],
        subject: `New Suggestion: ${escapeHtml(suggestionType)} - ${escapeHtml(title)}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-suggestion function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
