
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Bot, User, RefreshCw, Upload, Copy, Check, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TextEditor from '@/components/TextEditor';

// Define result type interfaces for type safety
interface DetectionResult {
  aiProbability: number;
  confidenceLevel: string;
  analysis: string;
  textLength: number;
  timestamp: string;
}

interface HumanizationResult {
  originalText: string;
  humanizedText: string;
  textLength: number;
  timestamp: string;
  note?: string;
}

interface Subscription {
  planType: string;
  status: string;
  usageThisMonth: {
    detections: number;
    humanizations: number;
  };
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [humanizationResult, setHumanizationResult] = useState<HumanizationResult | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Fetch subscription data on load
  useEffect(() => {
    if (currentUser) {
      fetchSubscription();
    }
  }, [currentUser]);

  const fetchSubscription = async () => {
    setIsLoadingSubscription(true);
    try {
      const response = await fetch(`http://localhost:5000/api/subscription/${currentUser.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setSubscription(data.data);
      } else {
        console.error('Failed to load subscription data');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const handleTextChange = (value: string) => {
    setInputText(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept text files
    if (!file.type.includes('text')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a text file (.txt)"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInputText(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const detectAIText = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "No text provided",
        description: "Please enter or upload some text first"
      });
      return;
    }

    // Check subscription limits for free plan
    if (subscription?.planType === 'free' && subscription?.usageThisMonth.detections >= 5) {
      toast({
        variant: "destructive",
        title: "Usage limit reached",
        description: "You've reached the free plan limit. Please upgrade to continue."
      });
      return;
    }

    setIsDetecting(true);
    setDetectionResult(null);
    setHumanizationResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/detect-ai-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          userId: currentUser.uid
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to detect AI text');
      }
      
      setDetectionResult(responseData.data);
      
      // Format result for display
      const result = `
AI Detection Results:
-----------------------
AI Probability: ${responseData.data.aiProbability.toFixed(1)}%
Confidence: ${responseData.data.confidenceLevel}

Analysis:
${responseData.data.analysis}
`;
      
      setResultText(result);
      
      toast({
        title: "Detection complete",
        description: "AI detection analysis has been completed"
      });
      
      // Refresh subscription data to get updated usage
      fetchSubscription();
    } catch (error) {
      console.error('Error detecting AI text:', error);
      toast({
        variant: "destructive",
        title: "Detection failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const humanizeText = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "No text provided",
        description: "Please enter or upload some text first"
      });
      return;
    }

    // Check subscription limits for free plan
    if (subscription?.planType === 'free' && subscription?.usageThisMonth.humanizations >= 3) {
      toast({
        variant: "destructive",
        title: "Usage limit reached",
        description: "You've reached the free plan limit. Please upgrade to continue."
      });
      return;
    }

    setIsHumanizing(true);
    setDetectionResult(null);
    setHumanizationResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/humanize-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          userId: currentUser.uid 
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to humanize text');
      }
      
      setHumanizationResult(responseData.data);
      
      // Format result for display
      const result = responseData.data.humanizedText;
      
      setResultText(result);
      
      toast({
        title: "Humanization complete",
        description: responseData.data.note || "Your text has been humanized successfully"
      });
      
      // Refresh subscription data to get updated usage
      fetchSubscription();
    } catch (error) {
      console.error('Error humanizing text:', error);
      toast({
        variant: "destructive",
        title: "Humanization failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsHumanizing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    setTextCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard"
    });
    
    setTimeout(() => setTextCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Text Analysis Dashboard</h1>
          
          {/* Subscription info card */}
          {subscription && subscription.planType === 'free' && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Free Plan Limits</h3>
                    <p className="text-sm text-muted-foreground">
                      You've used {subscription.usageThisMonth.detections}/5 detections and {subscription.usageThisMonth.humanizations}/3 humanizations this month.
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-primary font-medium" 
                        onClick={() => window.location.href = '/pricing'}
                      >
                        Upgrade now
                      </Button>
                      {' '}for unlimited access.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Text Input
              </CardTitle>
              <CardDescription>
                Paste your text below or upload a text file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextEditor 
                value={inputText} 
                onChange={handleTextChange} 
                placeholder="Paste or type your text here..." 
              />
              
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Upload className="w-4 h-4" />
                    Upload text file
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button 
                onClick={detectAIText} 
                disabled={
                  isDetecting || 
                  isHumanizing || 
                  !inputText.trim() || 
                  (subscription?.planType === 'free' && subscription?.usageThisMonth.detections >= 5)
                }
                className="flex items-center gap-2"
              >
                {isDetecting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                {isDetecting ? "Detecting..." : "Detect AI Text"}
              </Button>
              <Button 
                onClick={humanizeText} 
                disabled={
                  isDetecting || 
                  isHumanizing || 
                  !inputText.trim() || 
                  (subscription?.planType === 'free' && subscription?.usageThisMonth.humanizations >= 3)
                }
                className="flex items-center gap-2"
                variant="outline"
              >
                {isHumanizing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {isHumanizing ? "Humanizing..." : "Humanize Text"}
              </Button>
            </CardFooter>
          </Card>
          
          {resultText && (
            <Card className="animate-in slide-in-from-bottom-4 duration-300">
              <CardHeader>
                <CardTitle>
                  {detectionResult ? "AI Detection Results" : humanizationResult ? "Humanized Text" : "Results"}
                </CardTitle>
                {humanizationResult && (
                  <CardDescription>
                    Your text has been rewritten to sound more natural and human-like
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {resultText}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  {textCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to clipboard
                    </>
                  )}
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

export default Dashboard;
