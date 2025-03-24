
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            Welcome to our company! We are dedicated to providing outstanding services and solutions to our customers.
          </p>
          <p className="mb-4">
            Founded in 2020, our mission is to deliver innovative and high-quality products that meet the evolving needs of our clients.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p className="mb-4">
            Our team consists of experienced professionals who are passionate about what they do. We work collaboratively to ensure that we exceed our customers' expectations.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Excellence in everything we do</li>
            <li className="mb-2">Customer satisfaction is our priority</li>
            <li className="mb-2">Integrity and transparency in our operations</li>
            <li className="mb-2">Continuous innovation and improvement</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
