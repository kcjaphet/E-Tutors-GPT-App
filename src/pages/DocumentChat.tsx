
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilePdf, Send, Paperclip, Info, MessageSquare, UploadCloud } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const DocumentChat: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[]>([]);

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file."
      });
      return;
    }
    
    setSelectedFile(file);
    setDocumentTitle(file.name);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a PDF file to upload."
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real implementation, this would upload to a server endpoint
      // For now, we'll simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add a welcome message from the assistant
      setMessages([{
        role: 'assistant',
        content: `I've analyzed ${selectedFile.name}. What would you like to know about this document?`,
        timestamp: new Date()
      }]);
      
      toast({
        title: "Document uploaded",
        description: "The document has been processed successfully."
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your document."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setSending(true);
    setMessage('');
    
    try {
      // In a real implementation, this would send to a backend AI service
      // For now, we'll simulate an AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: `This is a simulated response to your query: "${message}".\nIn a full implementation, this would analyze the document and provide a contextually relevant answer based on the document's content.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Message failed",
        description: "There was an error processing your message."
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Document Chat</h1>
          
          <Tabs defaultValue={selectedFile ? "chat" : "upload"}>
            <TabsList className="mb-6">
              <TabsTrigger value="upload" disabled={uploading}>Upload</TabsTrigger>
              <TabsTrigger value="chat" disabled={!selectedFile || uploading}>Chat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload PDF Document</CardTitle>
                  <CardDescription>
                    Upload a PDF document to ask questions about its content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="border-2 border-dashed rounded-md border-gray-300 p-6 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="text-xl font-medium mb-2">Drag & Drop PDF here</div>
                    <div className="text-sm text-muted-foreground mb-5">or click to browse</div>
                    <label htmlFor="pdf-upload">
                      <Input 
                        id="pdf-upload" 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                      <Button variant="outline" className="cursor-pointer">
                        <Paperclip className="mr-2 h-4 w-4" /> Select PDF
                      </Button>
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="bg-muted p-4 rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <FilePdf className="h-6 w-6 mr-2 text-red-500" />
                        <div>
                          <div className="font-medium">{selectedFile.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={handleUpload} 
                        disabled={uploading}
                      >
                        {uploading ? "Processing..." : "Process Document"}
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    PDF files up to 50 MB are supported
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat">
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <FilePdf className="h-5 w-5 mr-2 text-red-500" />
                    {documentTitle || "Document Chat"}
                  </CardTitle>
                  <CardDescription>
                    Ask questions about the document content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] p-4 rounded-md border">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4" />
                        <p>No messages yet. Start by asking a question about the document.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              <div 
                                className={`text-xs mt-1 ${
                                  msg.role === 'user' 
                                    ? 'text-primary-foreground/70' 
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <form 
                    className="flex w-full items-center space-x-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <Input
                      type="text"
                      placeholder="Ask a question about the document..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={!message.trim() || sending}
                    >
                      {sending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </>
                      )}
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DocumentChat;
