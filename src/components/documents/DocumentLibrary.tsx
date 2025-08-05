import React, { useState, useEffect } from 'react';
import { FileText, MessageCircle, Trash2, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  title: string;
  file_name: string;
  file_size: number;
  status: string;
  created_at: string;
  conversations?: { id: string; title: string }[];
}

interface DocumentLibraryProps {
  onStartChat: (documentId: string, documentTitle: string) => void;
  refreshTrigger?: number;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ 
  onStartChat, 
  refreshTrigger 
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      
      console.log('=== Starting to fetch documents ===');
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('User not authenticated:', authError);
        throw new Error('Authentication required');
      }
      
      console.log('User authenticated, fetching documents for user:', user.id);
      
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          title,
          file_name,
          file_size,
          status,
          created_at,
          conversations:conversations(id, title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error fetching documents:', error);
        throw error;
      }

      console.log('Documents fetched successfully:', {
        count: data?.length || 0,
        documents: data?.map(d => ({ id: d.id, title: d.title, status: d.status }))
      });
      
      setDocuments(data || []);
    } catch (error) {
      console.error('=== Error in fetchDocuments ===', error);
      toast({
        title: "Error",
        description: `Failed to load documents: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const handleDelete = async (documentId: string, fileName: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      // Delete from database (this will cascade to conversations and messages)
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        throw dbError;
      }

      // Delete from storage
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([`${user.id}/${fileName}`]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          // Don't throw here - database record is already deleted
        }
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleReprocess = async (documentId: string) => {
    try {
      console.log('=== Starting reprocess for document:', documentId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }
      
      console.log('Session found, calling process-document function...');
      
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { documentId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      console.log('Function response:', data);

      toast({
        title: "Success",
        description: "Document reprocessing started",
      });

      // Refresh documents after a short delay
      setTimeout(fetchDocuments, 2000);
    } catch (error) {
      console.error('=== Reprocess error ===', error);
      toast({
        title: "Error",
        description: `Failed to reprocess document: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'processing': { variant: 'secondary' as const, text: 'Processing' },
      'completed': { variant: 'default' as const, text: 'Ready' },
      'failed': { variant: 'destructive' as const, text: 'Failed' }
    };
    
    const config = variants[status] || variants.processing;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading documents...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
        <p className="text-muted-foreground mb-4">
          Upload your first document to get started with AI-powered document chat
        </p>
        <button 
          onClick={() => console.log('Testing click - documents empty')}
          className="text-sm text-blue-500 underline"
        >
          Debug: Click to test console
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Documents</h2>
      
      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {doc.file_name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>{formatDistanceToNow(new Date(doc.created_at))} ago</span>
                    {doc.conversations && doc.conversations.length > 0 && (
                      <span>{doc.conversations.length} conversation(s)</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {getStatusBadge(doc.status)}
                
                {doc.status === 'completed' && (
                  <Button
                    size="sm"
                    onClick={() => onStartChat(doc.id, doc.title)}
                    className="gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Button>
                )}
                
                {(doc.status === 'failed' || doc.status === 'processing') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReprocess(doc.id)}
                    className="gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {doc.status === 'processing' ? 'Retry Process' : 'Retry'}
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(doc.id, doc.file_name)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};