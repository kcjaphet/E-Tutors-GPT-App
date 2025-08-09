import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
}

export const useSubscriptionStatus = () => {
  const { currentUser, session } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true,
    error: null
  });

  const checkSubscription = useCallback(async () => {
    if (!currentUser || !session) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        loading: false,
        error: null
      });
    } catch (error: unknown) {
      console.error('Error checking subscription:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription status'
      }));
    }
  }, [currentUser, session]);

  const hasFeatureAccess = (feature: 'detection' | 'humanization' | 'premium') => {
    if (status.loading) return false;
    
    // Free tier limits
    if (!status.subscribed) {
      return feature === 'detection' || feature === 'humanization'; // Limited free access
    }
    
    // All paid tiers have full access
    return true;
  };

  const getRemainingUsage = () => {
    if (status.subscribed) {
      return { detections: '∞', humanizations: '∞' };
    }
    
    // For free users, this would need to be tracked separately
    return { detections: 5, humanizations: 3 };
  };

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    ...status,
    checkSubscription,
    hasFeatureAccess,
    getRemainingUsage
  };
};