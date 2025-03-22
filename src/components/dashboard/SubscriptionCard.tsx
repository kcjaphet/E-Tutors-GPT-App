
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, RefreshCw, Sparkles } from 'lucide-react';

interface Subscription {
  planType: string;
  status: string;
  usageThisMonth: {
    detections: number;
    humanizations: number;
  };
  currentPeriodEnd?: Date;
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
  isLoadingSubscription: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  subscription, 
  isLoadingSubscription 
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (isLoadingSubscription) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading subscription information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) return null;

  return (
    <Card className="mb-6 bg-muted/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {subscription.planType === 'free' ? (
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold flex items-center gap-2">
                {subscription.planType === 'monthly' 
                  ? 'Monthly Plan' 
                  : subscription.planType === 'yearly' 
                    ? 'Yearly Plan' 
                    : 'Free Plan'}
                {subscription.status !== 'active' && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full dark:bg-red-900/20 dark:text-red-300">
                    {subscription.status}
                  </span>
                )}
              </h3>
              {subscription.currentPeriodEnd && subscription.planType !== 'free' && (
                <span className="text-xs text-muted-foreground">
                  Renews: {formatDate(subscription.currentPeriodEnd.toString())}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
              <div className="text-sm">
                <span className="text-muted-foreground">AI Detections:</span>{' '}
                <span className="font-medium">
                  {subscription.planType === 'free' 
                    ? `${subscription.usageThisMonth.detections}/5 used`
                    : `${subscription.usageThisMonth.detections} used (Unlimited)`}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Humanizations:</span>{' '}
                <span className="font-medium">
                  {subscription.planType === 'free' 
                    ? `${subscription.usageThisMonth.humanizations}/3 used`
                    : `${subscription.usageThisMonth.humanizations} used (Unlimited)`}
                </span>
              </div>
              
              {subscription.planType === 'free' && (
                <div className="w-full mt-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Upgrade for unlimited access
                  </Button>
                </div>
              )}
              
              {subscription.planType !== 'free' && (
                <div className="w-full mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => window.location.href = '/account'}
                  >
                    Manage subscription
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
