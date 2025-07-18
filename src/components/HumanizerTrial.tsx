
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Copy, User, FileText } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

const HumanizerTrial: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const { toast } = useToast();

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "No text provided",
        description: "Please enter some text to humanize"
      });
      return;
    }

    if (inputText.length > 500) {
      toast({
        variant: "destructive",
        title: "Text too long",
        description: "Please enter text under 500 characters for the trial"
      });
      return;
    }

    setIsProcessing(true);
    setOutputText('');
    
    try {
      const response = await fetch(API_ENDPOINTS.HUMANIZE_TEXT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          userId: 'trial-user'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      setOutputText(responseData.data.humanizedText);
      
      toast({
        title: "Humanization complete",
        description: "Your text has been humanized successfully"
      });
    } catch (error) {
      console.error('Error humanizing text:', error);
      toast({
        variant: "destructive",
        title: "Humanization failed",
        description: error instanceof Error 
          ? error.message 
          : "An error occurred. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setTextCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The humanized text has been copied to your clipboard"
    });
    
    setTimeout(() => setTextCopied(false), 2000);
  };

  const sampleTexts = [
    "Artificial intelligence has transformed numerous industries by automating complex processes and enhancing decision-making capabilities across various sectors.",
    "The implementation of machine learning algorithms enables organizations to analyze vast datasets and extract meaningful insights for strategic planning.",
    "Contemporary technological advancements facilitate unprecedented levels of efficiency and productivity in modern business operations."
  ];

  const loadSampleText = (text: string) => {
    setInputText(text);
    setOutputText('');
    toast({
      title: "Sample text loaded",
      description: "You can now test the humanizer with this sample text"
    });
  };

  return (
    <section className="container px-4 py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Try the AI Humanizer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience our AI humanization technology with a free trial. Enter up to 500 characters of AI-generated text and see how we make it sound more natural and human-like.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Free Trial - AI Text Humanizer
            </CardTitle>
            <CardDescription>
              Transform AI-generated text to sound more natural and human-like
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sample Texts Section - Enhanced */}
            <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Try these sample AI-generated texts:</span>
              </div>
              <div className="grid gap-2">
                {sampleTexts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => loadSampleText(text)}
                    className="text-left p-3 text-sm bg-background hover:bg-primary/5 border border-border rounded-md transition-colors duration-200 hover:border-primary/30"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium shrink-0">
                        Sample {index + 1}
                      </span>
                      <span className="text-muted-foreground line-clamp-2">
                        {text.length > 80 ? `${text.substring(0, 80)}...` : text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="trial-input" className="text-sm font-medium">
                Enter your AI-generated text (max 500 characters)
              </label>
              <Textarea
                id="trial-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here or use one of the sample texts above..."
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {inputText.length}/500 characters
                </span>
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText('');
                      setOutputText('');
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>

            <Button 
              onClick={handleHumanize}
              disabled={!inputText.trim() || isProcessing || inputText.length > 500}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Humanizing...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Humanize Text
                </>
              )}
            </Button>

            {outputText && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Humanized Result</label>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    {textCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm leading-relaxed">{outputText}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Want to humanize longer texts and access more features?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild>
                      <a href="/dashboard">Get Full Access</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/pricing">View Pricing</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HumanizerTrial;
