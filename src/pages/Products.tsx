
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TextTools from '@/components/TextTools';

const Products = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Our Products</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our powerful AI-driven text tools designed to help you detect, humanize, and perfect your content.
            </p>
          </div>
        </div>
        
        {/* Text Tools Section */}
        <TextTools />
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
