import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface DocumentUploadProps {
  onUploadComplete: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Upload started with files:', acceptedFiles);
    
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    console.log('Processing file:', file.name, file.size, file.type);
    
    // Validate file size (50MB limit)
    if (file.size > 52428800) {
      toast({
        title: "Error",
        description: "File size must be less than 50MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      console.log('Getting user authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Authentication required');
      }
      
      console.log('User authenticated:', user.id);

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      console.log('Uploading to storage path:', filePath);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload failed:', uploadError);
        throw uploadError;
      }
      
      console.log('Storage upload successful:', uploadData);

      // Create document record
      const { data: documentData, error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title: file.name.replace(/\.[^/.]+$/, ''),
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type,
          status: 'processing'
        })
        .select()
        .single();

      if (docError) throw docError;

      // Process document to extract text
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const { error: processError } = await supabase.functions.invoke('process-document', {
          body: { documentId: documentData.id },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        // Don't throw processing errors - document is uploaded
        if (processError) {
          console.warn('Processing error:', processError);
        }
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      onUploadComplete();

    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${isUploading ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground" />
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isUploading 
                ? 'Please wait while we process your document...'
                : isDragActive
                ? 'Drop your document here'
                : 'Drag and drop a document or click to browse'
              }
            </p>
          </div>
          
          {!isUploading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Supports PDF, TXT, DOC, DOCX (max 50MB)</span>
            </div>
          )}
          
          {!isUploading && (
            <Button variant="outline" className="mt-2">
              Choose File
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};