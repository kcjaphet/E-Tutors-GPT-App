
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Subscription {
  planType: string;
  status: string;
  usageThisMonth: {
    detections: number;
    humanizations: number;
  };
  currentPeriodEnd?: Date;
}

export const useSubscription = () => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSubscription();
    }
  }, [currentUser]);

  const getRemainingUsage = () => {
    if (!subscription) return { detections: 0, humanizations: 0 };
    
    if (subscription.planType === 'free') {
      return {
        detections: Math.max(0, 5 - subscription.usageThisMonth.detections),
        humanizations: Math.max(0, 3 - subscription.usageThisMonth.humanizations)
      };
    }
    
    // Unlimited for paid plans
    return { detections: '∞', humanizations: '∞' };
  };

  return { 
    subscription, 
    isLoading, 
    fetchSubscription, 
    getRemainingUsage 
  };
};
