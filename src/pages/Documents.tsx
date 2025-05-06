
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config/api';
import { FileText, Trash2, Search, Upload, FileCheck } from 'lucide-react';
import { useDocument } from '@/hooks/useDocument';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { 
    documents,
    uploading,
    fetchDocuments,
    uploadDocument
  } = useDocument();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const uploadedDoc = await uploadDocument(file);
      if (uploadedDoc) {
        toast({
          title: "Upload successful",
          description: "Your PDF has been successfully uploaded and is ready for summarization.",
        });
        setFile(null);
      }
    } catch (error: any) {
      console.error("Upload failed", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your document.",
        variant: "destructive",
      });
    }
  };

  const handleChatWithDocument = (documentId: string) => {
    navigate('/document-chat', { state: { documentId } });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="container py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">PDF Summary Tool</CardTitle>
            <CardDescription>Upload PDFs to summarize and chat with your documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="max-w-md"
                />
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload PDF"}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Title</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map(doc => (
                      <TableRow key={doc._id}>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            {doc.title}
                          </div>
                        </TableCell>
                        <TableCell>{(doc.size / 1024).toFixed(2)} KB</TableCell>
                        <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleChatWithDocument(doc._id)}
                            >
                              Summarize & Chat
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-4">No documents found. Upload a PDF to get started.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Documents;
