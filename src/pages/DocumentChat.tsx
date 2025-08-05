import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Send, MessageCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Document {
  id: string;
  title: string;
  file_name: string;
  status: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface Message {
  id: string;
  content: string;
  role: string;
  created_at: string;
}

const DocumentChat: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load documents and conversations
  useEffect(() => {
    if (currentUser) {
      loadDocuments();
      loadConversations();
    }
  }, [currentUser]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', currentUser!.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading documents:', error);
    } else {
      setDocuments(data || []);
    }
  };

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', currentUser!.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
    } else {
      setConversations(data || []);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('document-upload', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully"
      });

      loadDocuments();
      setSelectedDocument(data.document);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload document"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedDocument || isLoading) return;

    setIsLoading(true);
    const userMessage = messageInput;
    setMessageInput('');

    try {
      const { data, error } = await supabase.functions.invoke('document-chat', {
        body: {
          documentId: selectedDocument.id,
          message: userMessage,
          conversationId: selectedConversation
        }
      });

      if (error) throw error;

      // If this is a new conversation, update the selected conversation
      if (!selectedConversation) {
        setSelectedConversation(data.conversationId);
        loadConversations();
      }

      // Reload messages to get the latest conversation
      loadMessages(data.conversationId);

      toast({
        title: "Message sent",
        description: "AI has responded to your question"
      });
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: "destructive",
        title: "Message failed",
        description: "Failed to send message"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setSelectedConversation(null);
    setMessages([]);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AI Document Chat</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Documents Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents
                  </CardTitle>
                  <CardDescription>
                    Upload and select documents to chat with
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt,.ppt,.pptx,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedDocument?.id === doc.id
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <p className="font-medium text-sm truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">{doc.status}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              {/* Conversations Panel */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Conversations
                  </CardTitle>
                  <CardDescription>
                    Previous chat sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      onClick={startNewConversation}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                    
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {conversations.map((conv) => (
                          <div
                            key={conv.id}
                            className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                              selectedConversation === conv.id
                                ? 'bg-primary/10 border border-primary'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedConversation(conv.id)}
                          >
                            <p className="truncate">{conv.title}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Panel */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>
                    {selectedDocument ? `Chat with ${selectedDocument.title}` : 'Select a document to start chatting'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {!selectedDocument ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Alert>
                        <FileText className="w-4 h-4" />
                        <AlertDescription>
                          Please upload and select a document to start chatting with AI about its content.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <>
                      {/* Messages */}
                      <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="flex gap-2 mt-4">
                        <Input
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Ask a question about the document..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!messageInput.trim() || isLoading}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DocumentChat;