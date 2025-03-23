
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiteratureReviewWriter from '@/components/LiteratureReviewWriter';

const LiteratureReview: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Literature Review Writer</h1>
          <p className="text-muted-foreground mb-8">
            Generate structured literature reviews for your academic research. 
            Enter your topic and keywords to create a well-organized review.
          </p>
          
          <LiteratureReviewWriter />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LiteratureReview;
