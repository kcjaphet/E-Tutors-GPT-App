import React from 'react';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Crown, Loader2 } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature: 'detection' | 'humanization' | 'premium';
  fallback?: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  feature, 
  fallback 
}) => {
  const { hasFeatureAccess, loading, subscribed } = useSubscriptionStatus();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Checking subscription...</span>
      </div>
    );
  }

  if (!hasFeatureAccess(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Premium Feature</CardTitle>
          <CardDescription>
            {feature === 'premium' 
              ? 'This feature requires a premium subscription'
              : `You've reached your ${feature} limit for this month`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => navigate('/pricing')} className="w-full">
            {subscribed ? 'Upgrade Plan' : 'View Pricing'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;