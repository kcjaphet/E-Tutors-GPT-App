import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, operation, options = {} } = await req.json();

    if (!text || !operation) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Text and operation are required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'OpenAI API key not configured'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build the prompt based on operation
    let systemPrompt = '';
    let userPrompt = '';

    switch (operation) {
      case 'summarize':
        systemPrompt = 'You are a professional text summarizer. Create concise, informative summaries that capture the main points and key information.';
        userPrompt = `Please summarize the following text: "${text}"`;
        break;
      
      case 'paraphrase':
        systemPrompt = 'You are an expert at paraphrasing text. Rewrite the given text using different words and sentence structures while maintaining the original meaning.';
        userPrompt = `Please paraphrase the following text: "${text}"`;
        break;
      
      case 'translate':
        const language = options.language || 'Spanish';
        systemPrompt = `You are a professional translator. Translate text accurately while maintaining the original tone and meaning.`;
        userPrompt = `Please translate the following text to ${language}: "${text}"`;
        break;
      
      case 'grammar':
        systemPrompt = 'You are a grammar expert. Correct grammar, spelling, and punctuation errors while maintaining the original meaning and style.';
        userPrompt = `Please correct the grammar in the following text: "${text}"`;
        break;
      
      case 'tone':
        const tone = options.tone || 'professional';
        systemPrompt = `You are an expert at adjusting text tone. Rewrite text to match the specified tone while preserving the core message.`;
        userPrompt = `Please rewrite the following text in a ${tone} tone: "${text}"`;
        break;
      
      case 'enhance':
        systemPrompt = 'You are a writing enhancement expert. Improve text clarity, flow, and impact while maintaining the original meaning.';
        userPrompt = `Please enhance and improve the following text: "${text}"`;
        break;
      
      default:
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Unsupported operation'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }

    console.log(`Processing text with operation: ${operation}`);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: Math.min(4000, text.length * 2)
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to process text'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await response.json();
    const processedText = result.choices[0].message.content.trim();

    console.log('Text processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          processedText,
          operation,
          originalLength: text.length,
          processedLength: processedText.length,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in text-process function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to process text',
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});