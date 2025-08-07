
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL, API_CONFIG, API_ENDPOINTS } from '@/config/api';

export interface HumanizationResult {
  originalText: string;
  humanizedText: string;
  textLength: number;
  timestamp: string;
  note?: string;
}

export const useHumanization = () => {
  const { toast } = useToast();
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizationResult, setHumanizationResult] = useState<HumanizationResult | null>(null);

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
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (API_CONFIG.RETRY_ATTEMPTS - retries + 1)));
        return fetchWithRetry(url, options, retries - 1);
      }
      
      throw error;
    }
  };

  const humanizeText = async (
    inputText: string, 
    userId: string = 'anonymous',
    onSuccess?: () => void
  ) => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "No text provided",
        description: "Please enter or upload some text first"
      });
      return null;
    }

    setIsHumanizing(true);
    setHumanizationResult(null);
    
    try {
      const response = await fetchWithRetry(
        API_ENDPOINTS.HUMANIZE_TEXT,
        {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({ 
            text: inputText,
            userId
          }),
        }
      );
      
      const responseData = await response.json();
      setHumanizationResult(responseData.data);
      
      toast({
        title: "Humanization complete",
        description: responseData.data.note || "Your text has been humanized successfully"
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      return responseData.data;
    } catch (error) {
      console.error('Error humanizing text:', error);
      toast({
        variant: "destructive",
        title: "Humanization failed",
        description: error instanceof Error 
          ? `${error.message} Please try again later.` 
          : "Connection error. Please check your internet connection and try again."
      });
      return null;
    } finally {
      setIsHumanizing(false);
    }
  };

  return {
    humanizeText,
    isHumanizing,
    humanizationResult,
    setHumanizationResult
  };
};
