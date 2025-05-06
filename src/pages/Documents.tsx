
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  FilePdf,
  Search,
  Plus,
  Clock,
  MoreVertical,
  Download,
  Trash2,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  uploadDate: Date;
  lastAccessed?: Date;
  size: number;
  pages: number;
}

const Documents: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching documents
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDocuments: Document[] = [
          {
            id: '1',
            title: 'Annual Report 2023.pdf',
            uploadDate: new Date(2023, 10, 15),
            lastAccessed: new Date(2023, 11, 20),
            size: 2.4,
            pages: 32
          },
          {
            id: '2',
            title: 'Research Paper - AI Trends.pdf',
            uploadDate: new Date(2023, 9, 5),
            lastAccessed: new Date(2023, 11, 18),
            size: 1.8,
            pages: 24
          },
          {
            id: '3',
            title: 'Product Specifications.pdf',
            uploadDate: new Date(2023, 11, 1),
            size: 3.2,
            pages: 18
          }
        ];
        
        setDocuments(mockDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          variant: "destructive",
          title: "Failed to load documents",
          description: "There was a problem loading your documents."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [toast]);

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteDocument = (id: string, title: string) => {
    // In a real app, this would be an API call
    setDocuments(docs => docs.filter(doc => doc.id !== id));
    
    toast({
      title: "Document deleted",
      description: `${title} has been deleted.`
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Documents</h1>
            <Button onClick={() => navigate('/document-chat')}>
              <Plus className="h-4 w-4 mr-2" /> Upload New
            </Button>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-muted"></CardHeader>
                  <CardContent className="py-4">
                    <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <FilePdf className="h-8 w-8 text-red-500 mr-2" />
                        <div>
                          <CardTitle className="text-lg truncate max-w-[200px]">{doc.title}</CardTitle>
                          <CardDescription>
                            {doc.pages} pages • {doc.size} MB
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => navigate(`/document-chat?id=${doc.id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" /> Chat with this document
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>
                        Uploaded on {formatDate(doc.uploadDate)}
                        {doc.lastAccessed && ` • Last accessed ${formatDate(doc.lastAccessed)}`}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/document-chat?id=${doc.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with Document
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <FilePdf className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'No documents match your search' : 'Upload your first document to get started'}
                </p>
                <Button onClick={() => navigate('/document-chat')}>
                  <Plus className="h-4 w-4 mr-2" /> Upload Document
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Documents;
