
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
          <h2 className="text-3xl font-semibold mt-4 mb-6">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            We're sorry, the page you requested could not be found. Please check the URL or go back to the homepage.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
