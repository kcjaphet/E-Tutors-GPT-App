
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    title: 'Web Development',
    description: 'Custom websites built with the latest technologies',
    details: 'We create responsive, performant websites using modern frameworks like React, Next.js, and more.',
  },
  {
    title: 'App Development',
    description: 'Mobile applications for iOS and Android',
    details: 'Our team builds native and cross-platform mobile apps that deliver exceptional user experiences.',
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful interfaces with great user experience',
    details: 'We design intuitive interfaces that are visually appealing and provide excellent user experiences.',
  },
  {
    title: 'Consulting',
    description: 'Expert advice on tech implementation',
    details: 'Our consultants provide strategic guidance to help you make informed technology decisions.',
  },
];

const Services: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{service.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
