import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string, limit: number = 15, windowMs: number = 60000) => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

serve(async (req) => {
  console.log('Humanize function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user ID from request or use anonymous
    let userId = 'anonymous';
    
    // Optional authentication - try to get user if provided
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        );

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        
        if (!userError && user) {
          userId = user.id;
        }
      } catch (authError) {
        console.log('Auth failed, using anonymous:', authError);
      }
    }

    // Rate limiting (more lenient for anonymous users)
    const rateLimit = userId === 'anonymous' ? 8 : 15;
    if (!checkRateLimit(userId, rateLimit, 60000)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Rate limit exceeded. Please try again later.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing humanize request body...');
    const { text } = await req.json();
    console.log('Humanize request data:', { textLength: text?.length, userId });

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
    console.log('OpenAI API key status for humanization:', openAIApiKey ? 'Available' : 'Not available');
    
    if (!openAIApiKey) {
      console.log('Using mock humanization due to missing API key');
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
  // Enhanced mock humanization with more noticeable changes
  let humanized = text;
  
  // Add contractions (more comprehensive)
  humanized = humanized.replace(/\b(do not|does not|did not)\b/gi, (match) => {
    return match.replace(/ not/i, "n't");
  });
  humanized = humanized.replace(/\bwill not\b/gi, "won't");
  humanized = humanized.replace(/\bcannot\b/gi, "can't");
  humanized = humanized.replace(/\bit is\b/gi, "it's");
  humanized = humanized.replace(/\bthat is\b/gi, "that's");
  humanized = humanized.replace(/\bwe are\b/gi, "we're");
  humanized = humanized.replace(/\bthey are\b/gi, "they're");
  humanized = humanized.replace(/\byou are\b/gi, "you're");
  humanized = humanized.replace(/\bI am\b/gi, "I'm");
  humanized = humanized.replace(/\bwould not\b/gi, "wouldn't");
  humanized = humanized.replace(/\bshould not\b/gi, "shouldn't");
  humanized = humanized.replace(/\bcould not\b/gi, "couldn't");
  
  // Make formal transitions more conversational
  humanized = humanized.replace(/\bMoreover,\b/g, 'Plus,');
  humanized = humanized.replace(/\bFurthermore,\b/g, 'Also,');
  humanized = humanized.replace(/\bTherefore,\b/g, 'So,');
  humanized = humanized.replace(/\bHowever,\b/g, 'But,');
  humanized = humanized.replace(/\bNevertheless,\b/g, 'Still,');
  humanized = humanized.replace(/\bIn conclusion,\b/g, 'Overall,');
  humanized = humanized.replace(/\bIn addition,\b/g, 'Also,');
  humanized = humanized.replace(/\bConsequently,\b/g, 'As a result,');
  
  // Replace formal words with casual alternatives
  humanized = humanized.replace(/\butilize\b/gi, 'use');
  humanized = humanized.replace(/\bfacilitate\b/gi, 'help');
  humanized = humanized.replace(/\bdemonstrate\b/gi, 'show');
  humanized = humanized.replace(/\bimplement\b/gi, 'put in place');
  humanized = humanized.replace(/\bestablish\b/gi, 'set up');
  humanized = humanized.replace(/\bmaintain\b/gi, 'keep');
  humanized = humanized.replace(/\bobtain\b/gi, 'get');
  humanized = humanized.replace(/\bassist\b/gi, 'help');
  
  // Add occasional conversational elements
  const sentences = humanized.split(/[.!?]+/);
  const processedSentences = [];
  
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i].trim();
    if (sentence.length === 0) continue;
    
    // Add conversational starters to some sentences
    if (i > 0 && sentence.length > 30 && Math.random() < 0.4) {
      const starters = ['Look,', 'Well,', 'You know,', 'Actually,', 'Honestly,'];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      sentence = starter + ' ' + sentence.toLowerCase();
    }
    
    // Add emphasis words occasionally
    if (sentence.length > 40 && Math.random() < 0.3) {
      sentence = sentence.replace(/\bis\b/i, 'really is');
      sentence = sentence.replace(/\bwill\b/i, 'definitely will');
      sentence = sentence.replace(/\bcan\b/i, 'can definitely');
    }
    
    processedSentences.push(sentence);
  }
  
  humanized = processedSentences.join('. ') + '.';
  
  // Fix any double periods or spacing issues
  humanized = humanized.replace(/\.+/g, '.');
  humanized = humanized.replace(/\s+/g, ' ');
  humanized = humanized.trim();

  return {
    originalText: text,
    humanizedText: humanized,
    textLength: text.length,
    timestamp: new Date().toISOString(),
    resultId: `mock_humanize_${Date.now()}`,
    note: 'Text humanized using demo algorithm. For full AI-powered humanization, please configure OpenAI API key.'
  };
}