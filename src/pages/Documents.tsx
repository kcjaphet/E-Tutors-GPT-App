import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { API_ENDPOINTS } from '@/config/api';
import { FileText, Trash2, Search, Upload, FileCheck } from 'lucide-react';

interface Document {
  _id: string;
  title: string;
  filename: string;
  size: number;
  createdAt: string;
  processingStatus: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS.LIST}`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Could not fetch documents", error);
      toast({
        title: "Error fetching documents",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS.UPLOAD}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }

      toast({
        title: "Upload successful",
        description: "Your document has been successfully uploaded.",
      });
      fetchDocuments(); // Refresh document list
      setFile(null); // Clear selected file
    } catch (error: any) {
      console.error("Upload failed", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your document.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS.DELETE.replace(':id', id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
      fetchDocuments(); // Refresh document list
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the document.",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="container py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Your Documents</CardTitle>
            <CardDescription>Manage and chat with your uploaded documents.</CardDescription>
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
              <div className="flex items-center space-x-2">
                <Label htmlFor="upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload Document</span>
                  </div>
                </Label>
                <Input
                  type="file"
                  id="upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Filename</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map(doc => (
                      <TableRow key={doc._id}>
                        <TableCell>
                          <Link to="/document-chat" state={{ documentId: doc._id }} className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            {doc.title}
                          </Link>
                        </TableCell>
                        <TableCell>{doc.filename}</TableCell>
                        <TableCell>{(doc.size / 1024).toFixed(2)} KB</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {doc.processingStatus === 'completed' && <FileCheck className="mr-2 h-4 w-4 text-green-500" />}
                            {doc.processingStatus}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(doc._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-4">No documents found.</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end"></CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Documents;
