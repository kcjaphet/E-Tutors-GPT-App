import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocument } from '@/hooks/useDocument';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';

const DocumentChat: React.FC = () => {
  const location = useLocation();
  const { documentId } = location.state || {};
  const { document, loading, error } = useDocument(documentId);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (document) {
      // Initialize with a welcome message
      setMessages([
        {
          role: 'system',
          content: `Hello! I'm your document assistant. Ask me anything about "${document.title}".`
        }
      ]);
    }
  }, [document]);

  const handleSendMessage = async () => {
    if (!input.trim() || chatLoading) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setChatLoading(true);

    try {
      // Replace with your actual API call
      const response = await fetch(`/api/documents/${documentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Error chatting with document:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again."
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container py-10">
          <div className="flex justify-center items-center h-[60vh]">
            <p>Loading document...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !document) {
    return (
      <>
        <Header />
        <main className="container py-10">
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-red-500">Error loading document. Please try again.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-6">
        <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold">{document.title}</h1>
          </div>
          
          <Card className="flex-1 flex flex-col h-[70vh]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === 'user' 
                          ? 'flex-row-reverse space-x-reverse' 
                          : 'flex-row'
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        {message.role === 'user' ? (
                          <AvatarFallback>U</AvatarFallback>
                        ) : (
                          <AvatarFallback>AI</AvatarFallback>
                        )}
                      </Avatar>
                      <div 
                        className={`rounded-lg p-3 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about this document..."
                  className="flex-1 resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button type="submit" disabled={chatLoading || !input.trim()}>
                  Send
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DocumentChat;
