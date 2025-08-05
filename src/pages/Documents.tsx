import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentLibrary } from '@/components/documents/DocumentLibrary';
import { DocumentChat } from '@/components/documents/DocumentChat';
import { FileText, Upload, MessageCircle } from 'lucide-react';

type ViewMode = 'library' | 'chat';

const Documents = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStartChat = (documentId: string, documentTitle: string) => {
    setSelectedDocument({ id: documentId, title: documentTitle });
    setViewMode('chat');
  };

  const handleBackToLibrary = () => {
    setViewMode('library');
    setSelectedDocument(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Document AI Chat
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload documents and have intelligent conversations with AI about their content
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {viewMode === 'library' && (
            <>
              {/* Upload Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Upload Document</h2>
                </div>
                <DocumentUpload onUploadComplete={handleUploadComplete} />
              </section>

              {/* Library Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Document Library</h2>
                </div>
                <Card className="p-6">
                  <DocumentLibrary 
                    onStartChat={handleStartChat}
                    refreshTrigger={refreshTrigger}
                  />
                </Card>
              </section>
            </>
          )}

          {viewMode === 'chat' && selectedDocument && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Document Chat</h2>
              </div>
              <Card className="overflow-hidden">
                <DocumentChat
                  documentId={selectedDocument.id}
                  documentTitle={selectedDocument.title}
                  onBack={handleBackToLibrary}
                />
              </Card>
            </section>
          )}
        </div>

        {/* Features Info */}
        {viewMode === 'library' && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Easy Upload</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop PDF, TXT, DOC, or DOCX files up to 50MB
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Intelligent Chat</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions, get summaries, and explore document content with AI
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Organized Library</h3>
              <p className="text-sm text-muted-foreground">
                Keep all your documents organized with conversation history
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;