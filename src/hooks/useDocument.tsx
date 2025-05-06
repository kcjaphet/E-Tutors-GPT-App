
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/api';

export interface DocumentMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Document {
  _id: string;
  title: string;
  size: number;
  pageCount: number;
  createdAt: string;
  lastAccessed?: string;
}

export const useDocument = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<DocumentMessage[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  const fetchDocuments = async () => {
    if (!currentUser) return;
    
    setIsLoadingDocuments(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${currentUser.uid}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch documents');
      }
      
      setDocuments(data.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Failed to load documents",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const uploadDocument = async (file: File) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to upload documents"
      });
      return null;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', currentUser.uid);
      
      const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload document');
      }
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully."
      });
      
      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: `I've analyzed ${file.name}. What would you like to know about this document?`,
        timestamp: new Date()
      }]);
      
      // Refresh document list
      fetchDocuments();
      
      return data.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const chatWithDocument = async (documentId: string, message: string) => {
    if (!currentUser) return null;
    
    setProcessing(true);
    
    // Add user message to chat immediately
    const userMessage: DocumentMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          userId: currentUser.uid
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response');
      }
      
      // Add assistant response to chat
      const assistantMessage: DocumentMessage = {
        role: 'assistant',
        content: data.data.response,
        timestamp: new Date(data.data.timestamp)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (error) {
      console.error('Error chatting with document:', error);
      toast({
        variant: "destructive",
        title: "Failed to get response",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!currentUser) return false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete document');
      }
      
      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully."
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      return false;
    }
  };

  return {
    uploading,
    processing,
    documents,
    selectedDocument,
    messages,
    isLoadingDocuments,
    fetchDocuments,
    uploadDocument,
    chatWithDocument,
    deleteDocument,
    setSelectedDocument,
    setMessages
  };
};
