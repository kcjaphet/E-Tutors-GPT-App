
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingHeader from '@/components/pricing/PricingHeader';
import PricingCard from '@/components/pricing/PricingCard';
import PricingTable from '@/components/pricing/PricingTable';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import { pricingPlans } from '@/data/pricingPlans';
import { API_BASE_URL } from '@/config/api';

const Pricing: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    free: false,
    premium: false,
    pro: false
  });

  const handleSelectPlan = async (planId: string) => {
    // Set loading for the specific plan
    setIsLoading(prev => ({ ...prev, [planId]: true }));
    
    try {
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
        // For free plan, just show a success message and navigate to dashboard
        toast({
          title: "Free Plan Activated",
          description: "You're now on the Free Plan!"
        });
        navigate('/dashboard');
        return;
      }

      // For premium or pro plans, call the checkout endpoint
      const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          planType: planId,
          successUrl: `${window.location.origin}/subscription-success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Failed to start checkout process",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [planId]: false }));
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <PricingHeader />
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              onSelect={handleSelectPlan}
              isLoading={isLoading[plan.id]}
            />
          ))}
        </div>

        <PricingTable plans={pricingPlans} />
        <PricingFAQ />
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
