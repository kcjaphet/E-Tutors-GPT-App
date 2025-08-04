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
    const { text, userId = 'anonymous' } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Text input is required'
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
      // Return mock humanization if no API key
      const mockResult = generateMockHumanization(text);
      return new Response(
        JSON.stringify({
          success: true,
          data: mockResult
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Humanizing text with OpenAI:', text.substring(0, 100) + '...');

    // Use OpenAI to humanize the text
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
            content: `You are an expert text humanizer. Your task is to rewrite AI-generated or robotic text to make it sound more natural, conversational, and human-like while preserving the original meaning and key information.

Key principles for humanization:
1. Add natural variations in sentence structure and length
2. Include conversational elements like contractions, filler words
3. Make the tone more personal and engaging
4. Add subtle imperfections that humans naturally make
5. Include transitional phrases and connective language
6. Vary vocabulary to avoid repetitive patterns
7. Make it sound like a real person wrote it

Maintain:
- Original meaning and core information
- Professional tone when appropriate
- Factual accuracy
- Logical flow

Return only the humanized text without any explanations or metadata.`
          },
          {
            role: 'user',
            content: `Please humanize this text: "${text}"`
          }
        ],
        temperature: 0.8,
        max_tokens: Math.min(4000, text.length * 2)
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      const mockResult = generateMockHumanization(text);
      return new Response(
        JSON.stringify({
          success: true,
          data: mockResult
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await response.json();
    console.log('OpenAI humanization completed');

    const humanizedText = result.choices[0].message.content.trim();

    const humanizationResult = {
      originalText: text,
      humanizedText: humanizedText,
      textLength: text.length,
      timestamp: new Date().toISOString(),
      resultId: `humanize_${Date.now()}`,
      note: 'Text has been successfully humanized using AI'
    };

    console.log('Final humanization result completed');

    return new Response(
      JSON.stringify({
        success: true,
        data: humanizationResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in humanize-text function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to humanize text',
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateMockHumanization(text: string) {
  // Simple mock humanization - add some natural elements
  let humanized = text;
  
  // Add contractions
  humanized = humanized.replace(/\b(do not|does not|did not)\b/g, (match) => {
    return match.replace(' not', "n't");
  });
  humanized = humanized.replace(/\b(will not)\b/g, "won't");
  humanized = humanized.replace(/\b(cannot)\b/g, "can't");
  humanized = humanized.replace(/\b(it is)\b/g, "it's");
  humanized = humanized.replace(/\b(that is)\b/g, "that's");
  
  // Add some filler words occasionally
  const fillers = [', you know,', ', actually,', ', honestly,', ', frankly,'];
  const sentences = humanized.split('. ');
  
  for (let i = 0; i < sentences.length; i++) {
    if (Math.random() < 0.3 && sentences[i].length > 50) {
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      const words = sentences[i].split(' ');
      if (words.length > 8) {
        const insertPos = Math.floor(words.length / 2);
        words.splice(insertPos, 0, filler);
        sentences[i] = words.join(' ');
      }
    }
  }
  
  humanized = sentences.join('. ');
  
  // Make some sentences more conversational
  humanized = humanized.replace(/Moreover,/g, 'Plus,');
  humanized = humanized.replace(/Furthermore,/g, 'Also,');
  humanized = humanized.replace(/Therefore,/g, 'So,');
  humanized = humanized.replace(/In conclusion,/g, 'Overall,');

  return {
    originalText: text,
    humanizedText: humanized,
    textLength: text.length,
    timestamp: new Date().toISOString(),
    resultId: `mock_humanize_${Date.now()}`,
    note: 'Text humanized using demonstration algorithm. For full AI-powered humanization, OpenAI API key is required.'
  };
}