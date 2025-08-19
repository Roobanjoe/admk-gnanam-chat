import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-botpress-signature',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Botpress signature for security
    const secret = Deno.env.get('BOTPRESS_INBOUND_SECRET');
    const signature = req.headers.get("x-botpress-signature");
    
    if (!signature || signature !== secret) {
      console.error('Unauthorized request - invalid signature');
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    console.log('Received lead data:', body);

    const { name, email, message, phone, source = "botpress", conversationId, userId } = body;

    // Validate required fields
    if (!name || !email) {
      return new Response(JSON.stringify({ 
        error: "Name and email are required",
        ok: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate lead ID
    const leadId = "LD_" + Math.random().toString(36).slice(2).toUpperCase();

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert({
        lead_id: leadId,
        name: name,
        email: email,
        message: message,
        phone: phone,
        source: source,
        conversation_id: conversationId,
        botpress_user_id: userId,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        error: "Failed to save lead",
        ok: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Lead created successfully:', data);

    // Return success response
    return new Response(JSON.stringify({ 
      ok: true, 
      leadId: leadId,
      message: "Lead created successfully",
      data: data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-lead function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process lead creation',
      details: error.message,
      ok: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});