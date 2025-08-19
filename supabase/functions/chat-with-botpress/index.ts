import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // Use the Bot ID and Integration Token directly from secrets
    const botId = 'f66f1988-19d4-4a16-ab70-e7cc69c271fc';
    const integrationToken = 'bp_bak_xdA700eAawggx0r7cyNI4pR_jN-m-TS-iMmg';
    
    console.log('Bot ID:', botId);
    console.log('Using Botpress integration for message:', message);

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