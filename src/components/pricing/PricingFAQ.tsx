
import React from 'react';

const PricingFAQ: React.FC = () => {
  return (
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
  );
};

export default PricingFAQ;
