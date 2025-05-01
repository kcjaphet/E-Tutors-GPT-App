
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountInfo from '@/components/account/AccountInfo';
import EmailUpdateForm from '@/components/account/EmailUpdateForm';
import PasswordUpdateForm from '@/components/account/PasswordUpdateForm';
import DeleteAccountForm from '@/components/account/DeleteAccountForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config/api';

const Account = () => {
  const { currentUser } = useAuth();
  const { subscription, isLoading, fetchSubscription, getRemainingUsage } = useSubscription();
  
  // Redirect if not signed in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid
        }),
      });
      
      // Refresh subscription data
      fetchSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="space-y-8">
            {/* Account Info */}
            <AccountInfo email={currentUser.email} />
            
            {/* Subscription Info */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>Manage your subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p>Loading subscription information...</p>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-muted-foreground capitalize">{subscription?.planType || 'Free'}</p>
                    </div>
                    
                    {subscription?.planType !== 'free' && subscription?.currentPeriodEnd && (
                      <div>
                        <p className="text-sm font-medium">Renewal Date</p>
                        <p className="text-muted-foreground">
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium">Usage This Month</p>
                      <p className="text-muted-foreground">
                        Detections: {subscription?.usageThisMonth?.detections || 0} / 
                        {subscription?.planType !== 'free' ? '∞' : '5'}
                      </p>
                      <p className="text-muted-foreground">
                        Humanizations: {subscription?.usageThisMonth?.humanizations || 0} / 
                        {subscription?.planType !== 'free' ? '∞' : '3'}
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      {subscription?.planType === 'free' ? (
                        <Button variant="default" onClick={() => window.location.href = '/pricing'}>
                          Upgrade Plan
                        </Button>
                      ) : (
                        <Button variant="destructive" onClick={handleCancelSubscription}>
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Update Email Form */}
            <EmailUpdateForm currentEmail={currentUser.email} />
            
            {/* Update Password Form */}
            <PasswordUpdateForm />
            
            {/* Delete Account Form */}
            <DeleteAccountForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
