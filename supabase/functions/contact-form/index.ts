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
    console.log('Received contact form data:', body);

    const { 
      name, 
      email, 
      subject, 
      message, 
      phone,
      department = "general",
      priority = "normal",
      conversationId, 
      userId 
    } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        error: "Name, email, and message are required",
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

    // Generate ticket ID
    const ticketId = "TK_" + Math.random().toString(36).slice(2).toUpperCase();

    // Insert contact form submission into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        ticket_id: ticketId,
        name: name,
        email: email,
        subject: subject || `Contact from ${name}`,
        message: message,
        phone: phone,
        department: department,
        priority: priority,
        conversation_id: conversationId,
        botpress_user_id: userId,
        status: 'new',
        source: 'botpress_chat',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        error: "Failed to save contact form",
        ok: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Contact form submitted successfully:', data);

    // TODO: Send email notification or Slack message here
    // Example: await sendEmailNotification(data);
    // Example: await sendSlackNotification(data);

    // Return success response
    return new Response(JSON.stringify({ 
      ok: true, 
      ticketId: ticketId,
      message: "Your message has been received successfully",
      estimatedResponse: "24 hours",
      data: data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in contact-form function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process contact form',
      details: error.message,
      ok: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});