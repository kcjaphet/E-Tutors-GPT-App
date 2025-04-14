import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckIcon, XIcon, BadgeCheck, Sparkles, StarIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define the plan interface
interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceDetail: string;
  featured?: boolean;
  features: {
    title: string;
    included: boolean;
    detail?: string;
  }[];
}

const Pricing: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans: Plan[] = [
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
      id: 'monthly',
      name: 'Pro Monthly',
      description: 'Full access on a monthly billing cycle',
      price: '$11.99', // Updated price
      priceDetail: 'per month, billed yearly', // Updated price detail
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
      id: 'yearly',
      name: 'Pro Yearly',
      description: 'Our best value plan, save over 50%',
      price: '$8.99', // Updated price
      priceDetail: 'per month, billed yearly', // Updated price detail
      features: [
        { title: 'AI Text Detection', included: true, detail: 'Unlimited' },
        { title: 'Text Humanization', included: true, detail: 'Unlimited' },
        { title: 'Save History', included: true },
        { title: 'API Access', included: true, detail: '2000 calls/month' },
        { title: 'Priority Support', included: true },
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in or sign up to subscribe to a plan",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (planId === 'free') {
      toast({
        title: "Free Plan",
        description: "You're already on the Free Plan!"
      });
      return;
    }

    // Redirect to the checkout page or initiate checkout
    navigate(`/account?plan=${planId}`);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`flex flex-col ${plan.featured ? 'border-primary shadow-lg' : ''}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.featured && <Sparkles className="h-5 w-5 text-primary" />}
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
                  onClick={() => handleSelectPlan(plan.id)}
                  className="w-full"
                  variant={plan.featured ? "default" : "outline"}
                >
                  {plan.id === 'free' ? 'Get Started' : 'Subscribe'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Compare Plans</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Feature</TableHead>
                <TableHead>Free Plan</TableHead>
                <TableHead>Pro Monthly</TableHead>
                <TableHead>Pro Yearly</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">AI Text Detection</TableCell>
                <TableCell>5 per month</TableCell>
                <TableCell>Unlimited</TableCell>
                <TableCell>Unlimited</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Text Humanization</TableCell>
                <TableCell>3 per month</TableCell>
                <TableCell>Unlimited</TableCell>
                <TableCell>Unlimited</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Save History</TableCell>
                <TableCell>
                  <XIcon className="h-5 w-5 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <CheckIcon className="h-5 w-5 text-green-500" />
                </TableCell>
                <TableCell>
                  <CheckIcon className="h-5 w-5 text-green-500" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">API Access</TableCell>
                <TableCell>
                  <XIcon className="h-5 w-5 text-muted-foreground" />
                </TableCell>
                <TableCell>1000 calls/month</TableCell>
                <TableCell>2000 calls/month</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Priority Support</TableCell>
                <TableCell>
                  <XIcon className="h-5 w-5 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <CheckIcon className="h-5 w-5 text-green-500" />
                </TableCell>
                <TableCell>
                  <CheckIcon className="h-5 w-5 text-green-500" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Price</TableCell>
                <TableCell>$0</TableCell>
                <TableCell>$20/month</TableCell>
                <TableCell>$100/year ($8.33/month)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-left mt-8">
            <div>
              <h3 className="text-lg font-semibold">Can I switch plans?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">How do I cancel my subscription?</h3>
              <p className="text-muted-foreground">You can cancel your subscription from your account settings. Your access will continue until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Do you offer refunds?</h3>
              <p className="text-muted-foreground">We offer a 7-day money-back guarantee if you're not satisfied with your subscription.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards through our secure payment processor, Stripe.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
