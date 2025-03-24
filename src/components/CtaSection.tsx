
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Let's work together to build something amazing. Contact us today to discuss your project needs and goals.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link to="/contact">
            Get in Touch
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
