
import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SubscriptionSuccess: React.FC = () => {
  const { currentUser } = useAuth();
  const { fetchSubscription } = useSubscription();
  
  useEffect(() => {
    // Refresh subscription data when this page loads
    if (currentUser) {
      fetchSubscription();
    }
  }, [currentUser, fetchSubscription]);
  
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16 flex flex-col items-center">
        <Card className="w-full max-w-md border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-col items-center text-center pb-2">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
            <CardDescription>Your account has been upgraded successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-2">
            <p className="text-muted-foreground">
              Thank you for your subscription. Your account has been upgraded and you now have full access to all features.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-center">
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/account">View Subscription Details</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default SubscriptionSuccess;
