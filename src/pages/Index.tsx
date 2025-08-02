
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import TextTools from '@/components/TextTools';
import HumanizerTrial from '@/components/HumanizerTrial';
import FeaturesSection from '@/components/sections/FeaturesSection';
import CallToActionSection from '@/components/sections/CallToActionSection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <div className="mt-16">
          <HumanizerTrial />
        </div>
        
        <FeaturesSection />
        
        <TextTools />
        
        <CallToActionSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
