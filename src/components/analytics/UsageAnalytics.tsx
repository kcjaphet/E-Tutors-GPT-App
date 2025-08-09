import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Clock, Target, TrendingUp } from 'lucide-react';

interface UsageAnalyticsProps {
  subscription: {
    usageThisMonth: {
      detections: number;
      humanizations: number;
    };
    planType: string;
  } | null;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ subscription }) => {
  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const analytics = {
    detectionsUsed: subscription?.usageThisMonth?.detections || 0,
    humanizationsUsed: subscription?.usageThisMonth?.humanizations || 0,
    detectionsLimit: subscription?.planType === 'free' ? 5 : 999,
    humanizationsLimit: subscription?.planType === 'free' ? 3 : 999,
  };

  const stats = [
    {
      title: 'AI Detections',
      value: analytics.detectionsUsed,
      limit: analytics.detectionsLimit,
      icon: <Target className="w-4 h-4" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Text Humanizations',
      value: analytics.humanizationsUsed,
      limit: analytics.humanizationsLimit,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-green-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Usage Analytics
        </CardTitle>
        <CardDescription>Track your monthly usage and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stat.icon}
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stat.value} / {stat.limit === 999 ? '∞' : stat.limit}
              </span>
            </div>
            <Progress 
              value={stat.limit === 999 ? 0 : getUsagePercentage(stat.value, stat.limit)} 
              className="h-2" 
            />
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Resets monthly on your billing date</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageAnalytics;