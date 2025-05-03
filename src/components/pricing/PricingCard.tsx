
import React from 'react';
import { BadgeDollarSign, CheckIcon, XIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Define the feature interface
interface Feature {
  title: string;
  included: boolean;
  detail?: string;
}

// Define the plan interface
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceDetail: string;
  featured?: boolean;
  features: Feature[];
}

interface PricingCardProps {
  plan: Plan;
  onSelect: (planId: string) => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect, isLoading }) => {
  return (
    <Card 
      className={`flex flex-col ${plan.featured ? 'border-primary shadow-lg' : ''}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {plan.featured && <BadgeDollarSign className="h-5 w-5 text-primary" />}
          {plan.name}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mt-2 mb-6">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-muted-foreground ml-2">{plan.priceDetail}</span>
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              {feature.included ? (
                <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <XIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <span>
                {feature.title}
                {feature.detail && (
                  <span className="text-sm text-muted-foreground ml-1">
                    ({feature.detail})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onSelect(plan.id)}
          className="w-full"
          variant={plan.featured ? "default" : "outline"}
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
          ) : (
            plan.id === 'free' ? 'Get Started' : 'Subscribe Now'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
