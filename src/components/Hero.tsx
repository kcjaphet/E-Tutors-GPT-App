
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="container px-4 py-24 md:py-32">
      <div className="flex flex-col items-center text-center space-y-10">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-block">
            <span className="inline-flex animate-in stagger-1 items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Intelligent Text Processing
            </span>
          </div>
          
          <h1 className="animate-in stagger-2 text-4xl md:text-6xl font-semibold leading-tight md:leading-tight">
            Transform your text with <br />AI-powered precision
          </h1>
          
          <p className="animate-in stagger-3 text-xl text-muted-foreground max-w-2xl mx-auto">
            GPTTextTools leverages AI to help you summarize, paraphrase, translate, and enhance your text. Effortlessly powerful, elegantly simple.
          </p>
        </div>
        
        <div className="animate-in stagger-4 flex flex-col sm:flex-row gap-4">
          <Link 
            to="/tools" 
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-ring"
          >
            Try it now
          </Link>
          <Link 
            to="/about" 
            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary focus-ring"
          >
            Learn more
          </Link>
        </div>
        
        <div className="w-full max-w-4xl animate-in stagger-5">
          <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg subtle-shadow border border-gray-200/50 dark:border-gray-800/50">
            <div className="absolute inset-0 glass-panel p-6 flex items-center justify-center">
              <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-6 subtle-shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="h-6 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-3/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-12 w-full mt-6 bg-primary/20 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
