import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the configured enquiry email from site_settings
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase
      .from("site_settings")
      .select("enquiry_receiving_email")
      .limit(1)
      .single();

    const toEmail = settings?.enquiry_receiving_email || "info@artatcentral.com";

    // Log the enquiry (since we don't have an email service configured yet)
    console.log(`Enquiry received - To: ${toEmail}, From: ${name} <${email}>, Subject: ${subject || "General Enquiry"}, Message: ${message}`);

    return new Response(
      JSON.stringify({ success: true, message: "Enquiry submitted successfully." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error processing enquiry:", err);
    return new Response(
      JSON.stringify({ error: "Failed to process enquiry." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
