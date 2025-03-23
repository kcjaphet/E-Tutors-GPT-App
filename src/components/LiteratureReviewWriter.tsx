
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookText, RefreshCw, Copy, Check } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

const LiteratureReviewWriter: React.FC = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateReview = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a research topic",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate with a timeout
      setTimeout(() => {
        const sampleReview = `
# Literature Review: ${topic}

## Introduction
This literature review explores current research on ${topic}. The review synthesizes findings from multiple academic sources to provide a comprehensive overview of the field.

## Current Research
Several studies have investigated aspects of ${topic}. Key findings include theoretical frameworks, methodological approaches, and empirical results that contribute to our understanding of this area.

## Research Gaps
Despite extensive research, gaps remain in our understanding of ${topic}. Future studies could address limitations in current methodologies and explore new directions.

## Conclusion
This review has summarized the state of research on ${topic}, highlighting key findings and identifying areas for future investigation.
`;
        
        setResult(sampleReview);
        toast({
          title: "Review generated",
          description: "Your literature review has been generated successfully"
        });
      }, 2000);
    } catch (error) {
      console.error('Error generating review:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate literature review",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The literature review has been copied to your clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookText className="w-5 h-5" />
            Literature Review Writer
          </CardTitle>
          <CardDescription>
            Generate a structured literature review for your research topic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Research Topic</Label>
            <Input
              id="topic"
              placeholder="Enter your research topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords">
              Keywords (optional)
            </Label>
            <Input
              id="keywords"
              placeholder="Enter keywords separated by commas"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wordCount">
              Word Count (approximate)
            </Label>
            <Input
              id="wordCount"
              type="number"
              min={200}
              max={2000}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full"
            onClick={generateReview}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Literature Review"
            )}
          </Button>
          
          {result && (
            <div className="w-full space-y-4">
              <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                {result}
              </div>
              
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LiteratureReviewWriter;
