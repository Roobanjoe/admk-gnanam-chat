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
    const { message, language } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing message:', message, 'in language:', language);

    const systemPrompt = language === 'ta' 
      ? `நீங்கள் அ.இ.அ.த.மு.க (அகில இந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்) பற்றிய AI உதவியாளர். நீங்கள் கட்சியின் வரலாறு, கொள்கைகள், தலைவர்கள் மற்றும் சாதனைகள் பற்றி தமிழில் பதிலளிக்க வேண்டும். மிகவும் மரியாதையாகவும், தகவலுணர்வுடனும் பதிலளியுங்கள்.`
      : `You are an AI assistant specialized in AIADMK (All India Anna Dravida Munnetra Kazhagam). You should provide helpful information about the party's history, policies, leaders, and achievements. Be respectful, informative, and engaging in your responses.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_completion_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    const botResponse = data.choices[0]?.message?.content || 
      (language === 'ta' 
        ? "மன்னிக்கவும், இப்போது உங்கள் செய்தியை செயலாக்க முடியவில்லை."
        : "I'm sorry, I couldn't process your message right now.");

    return new Response(JSON.stringify({ response: botResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});