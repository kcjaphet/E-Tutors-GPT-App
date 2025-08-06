
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Subscription } from './useSubscription';
import { useHumanization } from './useHumanization';
import { API_BASE_URL, API_CONFIG, API_ENDPOINTS } from '@/config/api';

export interface DetectionResult {
  aiProbability: number;
  confidenceLevel: string;
  analysis: string;
  reasoning: string;
  highlightedSegments: string[];
  textLength: number;
  timestamp: string;
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
  const [textCopied, setTextCopied] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  // Use the new humanization hook
  const { humanizeText, isHumanizing, humanizationResult, setHumanizationResult } = useHumanization();

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

  // Utility function to fetch with timeout and retry
  const fetchWithRetry = async (url: string, options: RequestInit, retries = API_CONFIG.RETRY_ATTEMPTS) => {
    const timeout = API_CONFIG.TIMEOUT;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. The server took too long to respond.');
      }
      
      if (retries > 0) {
        console.log(`Retrying request. Attempts remaining: ${retries}`);
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (API_CONFIG.RETRY_ATTEMPTS - retries + 1)));
        return fetchWithRetry(url, options, retries - 1);
      }
      
      throw error;
    }
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
      console.log('Making API call to:', API_ENDPOINTS.DETECT_AI_TEXT);
      console.log('Request payload:', { text: inputText.substring(0, 100), userId: currentUser?.id || 'anonymous' });
      
      const response = await fetchWithRetry(
        API_ENDPOINTS.DETECT_AI_TEXT, 
        {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({ 
            text: inputText,
            userId: currentUser?.id || 'anonymous'
          }),
        }
      );
      
      console.log('API response status:', response.status);
      const responseData = await response.json();
      console.log('API response data:', responseData);
      
      setDetectionResult(responseData.data);
      console.log('Detection result set:', responseData.data);
      
      // Format result for display - now handled by ResultCard component
      setResultText("AI Detection Complete");
      
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
        description: error instanceof Error 
          ? `${error.message} Please try again later.` 
          : "Connection error. Please check your internet connection and try again."
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleHumanizeText = async () => {
    // Check subscription limits for free plan
    if (subscription?.planType === 'free' && subscription?.usageThisMonth.humanizations >= 3) {
      toast({
        variant: "destructive",
        title: "Usage limit reached",
        description: "You've reached the free plan limit. Please upgrade to continue."
      });
      return;
    }

    setDetectionResult(null);
    
    const result = await humanizeText(inputText, currentUser?.id || 'anonymous', () => {
      // Refresh subscription data to get updated usage
      fetchSubscription();
    });
    
    if (result) {
      setResultText(result.humanizedText);
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
    humanizeText: handleHumanizeText,
    copyToClipboard
  };
};
