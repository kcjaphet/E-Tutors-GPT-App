
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Working with this team has transformed our business. Their attention to detail and commitment to quality is unmatched.",
    author: "Sarah Johnson",
    role: "CEO, TechStart",
    avatar: "SJ"
  },
  {
    quote: "The expertise and professionalism they brought to our project exceeded our expectations. Highly recommended!",
    author: "Michael Chen",
    role: "Product Manager, InnovateCorp",
    avatar: "MC"
  },
  {
    quote: "They delivered our project on time and on budget, with excellent communication throughout the process.",
    author: "Lisa Rodriguez",
    role: "Marketing Director, GrowthBrand",
    avatar: "LR"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white dark:bg-gray-900 border-none shadow-md">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/40 mb-4" />
                <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="" alt={testimonial.author} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
