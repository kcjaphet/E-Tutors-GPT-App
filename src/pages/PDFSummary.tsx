
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';
import { FileUp, FileText, Copy, RefreshCw } from 'lucide-react';
import TextEditor from '@/components/TextEditor';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PDFSummary: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [textCopied, setTextCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    if (selectedFile.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file"
      });
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setSummaryText('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a PDF file first"
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('pdfFile', file);
      
      if (currentUser?.uid) {
        formData.append('userId', currentUser.uid);
      }
      
      const response = await fetch(API_ENDPOINTS.PDF_SUMMARY, {
        method: 'POST',
        body: formData,
        // No Content-Type header is needed, browser sets it automatically with boundary
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to process PDF');
      }
      
      setSummaryText(responseData.data.summary);
      
      toast({
        title: "PDF processed successfully",
        description: "Your PDF has been summarized"
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summaryText);
    setTextCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The summary has been copied to your clipboard"
    });
    
    setTimeout(() => setTextCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">PDF Summary Tool</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* File upload card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="w-5 h-5" />
                Upload PDF
              </CardTitle>
              <CardDescription>
                Upload a PDF file to generate a summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="cursor-pointer text-center">
                  <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF files only</p>
                </div>
              </div>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {fileName}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={isProcessing || !file}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {isProcessing ? "Processing..." : "Generate Summary"}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Results card - only show when there's a summary */}
          {summaryText && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Summary Results
                </CardTitle>
                <CardDescription>
                  The generated summary of your PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card overflow-hidden">
                  <div className="p-4">
                    <TextEditor 
                      value={summaryText}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                  {textCopied ? "Copied!" : "Copy to Clipboard"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PDFSummary;
