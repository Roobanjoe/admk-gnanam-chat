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
    console.log('Received status check request:', body);

    const { ticketId, leadId, email, type = "ticket" } = body;

    // Validate required fields
    if (!ticketId && !leadId && !email) {
      return new Response(JSON.stringify({ 
        error: "Ticket ID, Lead ID, or email is required",
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

    let data = null;
    let error = null;

    if (type === "ticket" || ticketId) {
      // Check contact submission status
      const query = supabase
        .from('contact_submissions')
        .select('ticket_id, status, subject, created_at, updated_at');

      if (ticketId) {
        query.eq('ticket_id', ticketId);
      } else if (email) {
        query.eq('email', email).order('created_at', { ascending: false }).limit(5);
      }

      const result = await query;
      data = result.data;
      error = result.error;
    } else if (type === "lead" || leadId) {
      // Check lead status
      const query = supabase
        .from('leads')
        .select('lead_id, status, name, created_at, updated_at');

      if (leadId) {
        query.eq('lead_id', leadId);
      } else if (email) {
        query.eq('email', email).order('created_at', { ascending: false }).limit(5);
      }

      const result = await query;
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        error: "Failed to check status",
        ok: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ 
        ok: true,
        found: false,
        message: "No records found with the provided information"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Status check successful:', data);

    // Format response
    const formatStatus = (status: string) => {
      const statusMap: { [key: string]: string } = {
        'new': 'Received - Under Review',
        'in_progress': 'In Progress',
        'waiting': 'Waiting for Information',
        'resolved': 'Resolved',
        'closed': 'Closed',
        'contacted': 'Contacted',
        'qualified': 'Qualified Lead'
      };
      return statusMap[status] || status;
    };

    const results = data.map((item: any) => ({
      id: item.ticket_id || item.lead_id,
      status: formatStatus(item.status),
      subject: item.subject || item.name,
      created: new Date(item.created_at).toLocaleDateString(),
      updated: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : null
    }));

    // Return success response
    return new Response(JSON.stringify({ 
      ok: true,
      found: true,
      results: results,
      count: results.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-status function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process status check',
      details: error.message,
      ok: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});