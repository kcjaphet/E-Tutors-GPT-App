
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import TextTools from '@/components/TextTools';
import HumanizerTrial from '@/components/HumanizerTrial';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Humanizer Trial Section - Positioned 5cm below hero */}
        <div className="pt-8">
          <HumanizerTrial />
        </div>
        
        {/* Features Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover what makes GPTTextTools the perfect solution for all your text processing needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Effortless Processing',
                description: 'Transform your text with just a few clicks. No complicated setup or technical knowledge required.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"></path><path d="M13.9 21.818a10 10 0 0 1-3.8 0"></path><path d="M17.6 4.045a10 10 0 0 1 2.9 2.91"></path><path d="M3.5 6.955a10 10 0 0 1 2.9-2.91"></path><path d="M20.5 17.045a10 10 0 0 1-2.9 2.91"></path><path d="M6.4 19.955a10 10 0 0 1-2.9-2.91"></path><path d="M21.818 13.9a10 10 0 0 1 0-3.8"></path><path d="M2.182 10.1a10 10 0 0 1 0 3.8"></path><circle cx="12" cy="12" r="6"></circle></svg>
                ),
              },
              {
                title: 'AI-Powered Intelligence',
                description: 'Leverage advanced AI models to improve, transform, and enhance your text with remarkable accuracy.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2H2v10h10V2Z"></path><path d="M12 22h10V12H12v10Z"></path><path d="m4.93 12.93 4.24 4.24"></path><path d="M2 22 22 2"></path></svg>
                ),
              },
              {
                title: 'Multiple Tools in One',
                description: 'Access a wide range of text tools all in one place. Summary, paraphrasing, translation, and more.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 3c.53 0 1.039.211 1.414.586s.586.884.586 1.414-.211 1.039-.586 1.414S12.53 7 12 7s-1.039-.211-1.414-.586S10 5.53 10 5s.211-1.039.586-1.414S11.47 3 12 3zm0 17c.53 0 1.039-.211 1.414-.586s.586-.884.586-1.414-.211-1.039-.586-1.414S12.53 16 12 16s-1.039.211-1.414.586S10 17.47 10 18s.211 1.039.586 1.414S11.47 20 12 20zm-7-7c.53 0 1.039-.211 1.414-.586S7 11.53 7 11s-.211-1.039-.586-1.414S5.53 9 5 9s-1.039.211-1.414.586S3 9.47 3 10s.211 1.039.586 1.414S4.47 13 5 13zm14 0c.53 0 1.039-.211 1.414-.586S21 11.53 21 11s-.211-1.039-.586-1.414S19.53 9 19 9s-1.039.211-1.414.586S17 9.47 17 10s.211 1.039.586 1.414S18.47 13 19 13z"></path></svg>
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg subtle-shadow border border-gray-200/50 dark:border-gray-800/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Text Tools Section */}
        <TextTools />
        
        {/* Call to Action */}
        <section className="container px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto glass-panel rounded-xl border border-gray-200/50 dark:border-gray-800/50 p-8 md:p-12 subtle-shadow text-center">
            <h2 className="text-3xl font-semibold mb-4">Ready to transform your text?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already enhancing their writing with our powerful tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-ring"
              >
                Get started for free
              </Link>
              <Link 
                to="/pricing" 
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary focus-ring"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
