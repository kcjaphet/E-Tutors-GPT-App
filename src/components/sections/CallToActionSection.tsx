
import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection: React.FC = () => {
  return (
    <section className="container px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto bg-card rounded-xl border shadow-lg text-center p-8 md:p-12">
        <h2 className="text-3xl font-semibold mb-4">Ready to transform your text?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already enhancing their writing with our powerful tools.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/signup" 
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Get started for free
          </Link>
          <Link 
            to="/pricing" 
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
