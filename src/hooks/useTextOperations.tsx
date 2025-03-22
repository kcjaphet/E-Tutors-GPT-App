
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Subscription } from './useSubscription';

export interface DetectionResult {
  aiProbability: number;
  confidenceLevel: string;
  analysis: string;
  textLength: number;
  timestamp: string;
}

export interface HumanizationResult {
  originalText: string;
  humanizedText: string;
  textLength: number;
  timestamp: string;
  note?: string;
}

export const useTextOperations = (
  currentUser: any, 
  subscription: Subscription | null, 
  fetchSubscription: () => Promise<void>
) => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [humanizationResult, setHumanizationResult] = useState<HumanizationResult | null>(null);

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

  return {
    inputText,
    resultText,
    isDetecting,
    isHumanizing,
    textCopied,
    detectionResult,
    humanizationResult,
    handleTextChange,
    handleFileUpload,
    detectAIText,
    humanizeText,
    copyToClipboard
  };
};
