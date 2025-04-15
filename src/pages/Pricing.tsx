
import React from 'react';
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

const Pricing: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        <PricingHeader />
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              onSelect={handleSelectPlan} 
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
