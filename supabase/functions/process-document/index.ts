import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    console.log('Process document request received');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }

    // Get the JWT token and verify user
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      throw new Error('Authentication failed');
    }

    console.log('User authenticated:', user.id);

    const { documentId } = await req.json();
    
    if (!documentId) {
      console.error('No document ID provided');
      throw new Error('Document ID is required');
    }

    console.log('Processing document:', documentId);

    // Get document from database
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      throw new Error('Document not found or access denied');
    }

    // Download file from storage
    console.log('Attempting to download file from path:', document.file_path);
    
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('documents')
      .download(document.file_path);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      console.error('File path attempted:', document.file_path);
      throw new Error(`Failed to download document: ${downloadError?.message || 'No file data'}`);
    }

    console.log('File downloaded successfully, size:', fileData.size);

    let extractedText = '';
    
    // Process based on file type
    if (document.mime_type === 'application/pdf') {
      // For PDF processing, we'll use a simple text extraction
      // In a real implementation, you'd use a proper PDF parsing library
      const arrayBuffer = await fileData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simple text extraction - in production, use a proper PDF parser
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const text = decoder.decode(uint8Array);
      
      // Extract readable text (very basic approach)
      const textRegex = /BT\s+.*?ET/gs;
      const matches = text.match(textRegex);
      if (matches) {
        extractedText = matches.join(' ').replace(/[^\x20-\x7E\n]/g, ' ').trim();
      } else {
        // Fallback: try to extract any readable text
        extractedText = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
      }
      
      if (!extractedText || extractedText.length < 50) {
        extractedText = 'Text extraction from PDF not fully supported yet. Please try uploading a text file instead.';
      }
    } else if (document.mime_type.startsWith('text/')) {
      // For text files, just read the content
      extractedText = await fileData.text();
    } else {
      throw new Error('Unsupported file type for text extraction');
    }

    // Update document with extracted text
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        extracted_text: extractedText,
        status: 'completed'
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document:', updateError);
      throw new Error('Failed to update document');
    }

    console.log('Document processed successfully:', documentId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document processed successfully',
        extractedText: extractedText.substring(0, 500) + '...' // Return preview
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-document function:', error);
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