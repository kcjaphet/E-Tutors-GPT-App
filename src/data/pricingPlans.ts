
export interface PlanFeature {
  title: string;
  included: boolean;
  detail?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceDetail: string;
  featured?: boolean;
  features: PlanFeature[];
}

export const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Basic access to essential features',
    price: '$0',
    priceDetail: 'Free forever',
    features: [
      { title: 'AI Text Detection', included: true, detail: '5 per month' },
      { title: 'Text Humanization', included: true, detail: '3 per month' },
      { title: 'Save History', included: false },
      { title: 'API Access', included: false },
      { title: 'Priority Support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Our best value plan with all features',
    price: '$8.99',
    priceDetail: 'per month, billed yearly',
    featured: true,
    features: [
      { title: 'AI Text Detection', included: true, detail: 'Unlimited' },
      { title: 'Text Humanization', included: true, detail: 'Unlimited' },
      { title: 'Save History', included: true },
      { title: 'API Access', included: true, detail: '1000 calls/month' },
      { title: 'Priority Support', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Full access on a monthly billing cycle',
    price: '$11.99',
    priceDetail: 'per month',
    features: [
      { title: 'AI Text Detection', included: true, detail: 'Unlimited' },
      { title: 'Text Humanization', included: true, detail: 'Unlimited' },
      { title: 'Save History', included: true },
      { title: 'API Access', included: true, detail: '2000 calls/month' },
      { title: 'Priority Support', included: true },
    ],
  },
];
