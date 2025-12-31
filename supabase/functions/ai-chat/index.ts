import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, generateImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('AI Chat request:', { messageCount: messages?.length, generateImage });

    // Choose model based on request type
    const model = generateImage 
      ? 'google/gemini-2.5-flash-image-preview' 
      : 'google/gemini-2.5-flash';

    const requestBody: any = {
      model,
      messages: [
        { 
          role: 'system', 
          content: `You are BrightHub AI, a helpful, versatile AI assistant. You can help with:
- Answering questions on any topic
- Writing and explaining code in any programming language
- Creative writing and brainstorming
- Math and science problems
- Language translation
- General knowledge and research

Be friendly, helpful, and thorough in your responses. If asked to generate code, provide complete, working examples with explanations.

When the user asks you to create a project or code, provide the complete code that can be saved as files.`
        },
        ...messages,
      ],
    };

    // Add modalities for image generation
    if (generateImage) {
      requestBody.modalities = ['image', 'text'];
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment and try again.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Usage limit reached. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received successfully');

    // Extract content and images
    const content = data.choices?.[0]?.message?.content || '';
    const images = data.choices?.[0]?.message?.images || [];

    return new Response(JSON.stringify({ 
      content,
      images,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
