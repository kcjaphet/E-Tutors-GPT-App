import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the JWT token and verify user
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { message, conversationId, documentId } = await req.json();
    
    if (!message || !conversationId) {
      throw new Error('Message and conversation ID are required');
    }

    console.log('Chat request for conversation:', conversationId);

    // Get conversation and verify ownership
    const { data: conversation, error: convError } = await supabaseClient
      .from('conversations')
      .select(`
        *,
        documents (
          id,
          title,
          extracted_text
        )
      `)
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (convError || !conversation) {
      throw new Error('Conversation not found or access denied');
    }

    // Get recent conversation history
    const { data: recentMessages, error: messagesError } = await supabaseClient
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20);

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
    }

    // Save user message
    const { error: userMessageError } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message
      });

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError);
    }

    // Prepare context from document
    const documentContext = conversation.documents?.extracted_text || 'No document content available.';
    
    // Prepare conversation history
    const conversationHistory = recentMessages ? recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    })) : [];

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant that answers questions about documents. 
        
Document Title: ${conversation.documents?.title || 'Unknown'}

Document Content:
${documentContext}

Instructions:
- Answer questions based on the document content above
- If the question cannot be answered from the document, say so clearly
- Be concise but thorough in your responses
- Quote relevant parts of the document when appropriate
- If the document content seems incomplete or corrupted, mention this limitation`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Sending request to OpenAI...');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('Received response from OpenAI');

    // Save assistant message
    const { error: assistantMessageError } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage
      });

    if (assistantMessageError) {
      console.error('Error saving assistant message:', assistantMessageError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: assistantMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-document function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});