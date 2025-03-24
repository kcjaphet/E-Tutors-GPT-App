
import React from 'react';
import { Code, Lightbulb, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Fast Performance',
    description: 'Optimized solutions that deliver lightning-fast performance for your applications and websites.'
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: 'Secure by Design',
    description: 'We implement best practices for security at every stage of development to protect your data.'
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: 'Clean Code',
    description: 'Well-structured, maintainable code that scales with your business and adapts to changing needs.'
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: 'Innovative Solutions',
    description: 'Creative approaches to solve complex problems with elegant, effective solutions.'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine technical expertise with creative thinking to deliver exceptional results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
