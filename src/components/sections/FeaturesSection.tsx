
import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Real-Time Analysis',
      description: 'Get instant feedback as you type with live AI detection and analysis for immediate insights.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M10.1 2.182a10 10 0 0 1 3.8 0"></path>
          <path d="M13.9 21.818a10 10 0 0 1-3.8 0"></path>
          <path d="M17.6 4.045a10 10 0 0 1 2.9 2.91"></path>
          <path d="M3.5 6.955a10 10 0 0 1 2.9-2.91"></path>
          <path d="M20.5 17.045a10 10 0 0 1-2.9 2.91"></path>
          <path d="M6.4 19.955a10 10 0 0 1-2.9-2.91"></path>
          <path d="M21.818 13.9a10 10 0 0 1 0-3.8"></path>
          <path d="M2.182 10.1a10 10 0 0 1 0 3.8"></path>
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      ),
    },
    {
      title: 'Advanced Text Metrics',
      description: 'Comprehensive text analysis including readability scores, sentiment analysis, and writing insights.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
    },
    {
      title: 'Professional Templates',
      description: 'Start with expert-crafted templates for emails, essays, reports, and business documents.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      ),
    },
    {
      title: 'Enhanced Export Options',
      description: 'Download, share, and export your results in multiple formats with one-click actions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7,10 12,15 17,10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      ),
    },
    {
      title: 'Usage Analytics',
      description: 'Track your productivity with detailed analytics showing usage patterns and performance metrics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
    },
    {
      title: 'Smart Processing',
      description: 'Intelligent text processing with context awareness and adaptive algorithms for better results.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 2H2v10h10V2Z"></path>
          <path d="M12 22h10V12H12v10Z"></path>
          <path d="m4.93 12.93 4.24 4.24"></path>
          <path d="M2 22 22 2"></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="container px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover what makes GPTTextTools the perfect solution for all your text processing needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
