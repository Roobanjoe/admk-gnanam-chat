import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    const botId = Deno.env.get('BOTPRESS_BOT_ID');
    const integrationToken = Deno.env.get('BOTPRESS_INTEGRATION_TOKEN');
    
    if (!botId || !integrationToken) {
      throw new Error('Botpress credentials not configured');
    }

    console.log('Sending message to Botpress:', message);

    const response = await fetch(`https://chat.botpress.cloud/${botId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integrationToken}`,
        'Content-Type': 'application/json',
        'x-bot-id': botId,
      },
      body: JSON.stringify({
        type: 'text',
        payload: {
          text: message
        }
      }),
    });

    if (!response.ok) {
      console.error('Botpress API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Botpress API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Botpress response:', data);
    
    // Extract the bot's response text
    let botResponse = "I'm sorry, I couldn't process your message right now.";
    
    if (data.responses && data.responses.length > 0) {
      const textResponse = data.responses.find((r: any) => r.type === 'text');
      if (textResponse && textResponse.payload && textResponse.payload.text) {
        botResponse = textResponse.payload.text;
      }
    }

    return new Response(JSON.stringify({ response: botResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-botpress function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});