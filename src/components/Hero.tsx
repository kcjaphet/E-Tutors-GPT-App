import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroAIDetector from './HeroAIDetector';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background">
      <div className="container relative z-10 px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Main Tagline */}
          <div className="space-y-6 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
            >
              Smart Tools for Smarter Content: 
              <br />
              Detect, Humanize, and Summarize with Ease.
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl md:text-3xl font-semibold text-primary/80 mt-4"
            >
              Pass Any AI Detector. Sound 100% Human.
            </motion.h2>
          </div>
          
          <div className="animate-in stagger-4 flex flex-col sm:flex-row gap-4">
            <Link 
              to="/ai-detection" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-ring"
            >
              Try it now
            </Link>
            <Link 
              to="/products" 
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-lg transition-colors hover:bg-secondary focus-ring"
            >
              Learn more
            </Link>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full max-w-4xl animate-in stagger-5"
          >
            <HeroAIDetector />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
