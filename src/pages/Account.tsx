
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, User, ShieldAlert, Unlock, Loader2, BadgeCheck, Calendar, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Subscription {
  planType: string;
  status: string;
  currentPeriodEnd?: Date;
  usageThisMonth: {
    detections: number;
    humanizations: number;
  };
}

const Account: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  
  const planFromUrl = searchParams.get('plan');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch user subscription data
  useEffect(() => {
    if (currentUser) {
      fetchSubscription();
    }
  }, [currentUser]);

  // Handle plan upgrade from URL parameter
  useEffect(() => {
    if (planFromUrl && currentUser && subscription) {
      // If user is already on this plan, don't try to upgrade
      if (subscription.planType === planFromUrl) {
        toast({
          title: "Already subscribed",
          description: `You're already on the ${planFromUrl === 'monthly' ? 'Monthly' : 'Yearly'} plan.`
        });
        navigate('/account', { replace: true });
        return;
      }
      
      // If user clicked an upgrade/downgrade link
      handleUpgrade(planFromUrl);
    }
  }, [planFromUrl, currentUser, subscription]);

  const fetchSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/subscription/${currentUser?.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setSubscription(data.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load subscription data"
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not connect to the server"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planType: string) => {
    if (!currentUser) return;
    
    setIsUpgrading(true);
    try {
      // Create a checkout session
      const response = await fetch('http://localhost:5000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          planType,
          successUrl: `${window.location.origin}/account?success=true`,
          cancelUrl: `${window.location.origin}/account?canceled=true`
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentUser) return;
    
    setIsCanceling(true);
    try {
      const response = await fetch('http://localhost:5000/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Subscription canceled",
          description: "Your subscription will end at the current billing period"
        });
        setConfirmCancel(false);
        // Refresh subscription data
        fetchSubscription();
      } else {
        throw new Error(data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        variant: "destructive",
        title: "Cancellation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'free': return 'Free Plan';
      case 'monthly': return 'Pro Monthly';
      case 'yearly': return 'Pro Yearly';
      default: return planType;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'canceled': return 'text-yellow-500';
      case 'past_due': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  if (!currentUser) {
    return null; // Redirect handled in useEffect
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          <Tabs defaultValue="subscription">
            <TabsList className="mb-6">
              <TabsTrigger value="subscription">
                <CreditCard className="mr-2 h-4 w-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : subscription ? (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                          <div className="bg-muted p-4 rounded-md">
                            <div className="flex items-center">
                              <BadgeCheck className="h-5 w-5 text-primary mr-2" />
                              <span className="font-medium">{getPlanName(subscription.planType)}</span>
                            </div>
                            <div className="mt-2 flex items-center">
                              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(subscription.status)} bg-background border`}>
                                <span>{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</span>
                              </div>
                            </div>
                            {subscription.planType !== 'free' && subscription.currentPeriodEnd && (
                              <div className="mt-2 text-sm text-muted-foreground flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {subscription.status === 'canceled' 
                                    ? `Access until: ${formatDate(subscription.currentPeriodEnd)}`
                                    : `Next billing date: ${formatDate(subscription.currentPeriodEnd)}`
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">Usage This Month</h3>
                          <div className="bg-muted p-4 rounded-md space-y-2">
                            <div className="flex justify-between">
                              <span>AI Detections:</span>
                              <span className="font-medium">
                                {subscription.usageThisMonth.detections}
                                {subscription.planType === 'free' && ' / 5'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Text Humanizations:</span>
                              <span className="font-medium">
                                {subscription.usageThisMonth.humanizations}
                                {subscription.planType === 'free' && ' / 3'}
                              </span>
                            </div>
                            <div className="pt-2 text-xs text-muted-foreground">
                              <RefreshCw className="h-3 w-3 inline mr-1" />
                              Resets at the beginning of each month
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Upgrade/Downgrade options */}
                      {subscription.planType !== 'monthly' && (
                        <div>
                          <Button 
                            onClick={() => handleUpgrade('monthly')}
                            disabled={isUpgrading}
                            className="mr-4"
                          >
                            {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upgrade to Pro Monthly
                          </Button>
                        </div>
                      )}
                      
                      {subscription.planType !== 'yearly' && (
                        <div>
                          <Button 
                            onClick={() => handleUpgrade('yearly')}
                            disabled={isUpgrading}
                            className="mr-4"
                          >
                            {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upgrade to Pro Yearly
                          </Button>
                        </div>
                      )}
                      
                      {/* Cancel subscription option */}
                      {(subscription.planType === 'monthly' || subscription.planType === 'yearly') && 
                       subscription.status === 'active' && (
                        <div className="mt-4">
                          <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="text-destructive">
                                Cancel Subscription
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Subscription</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel your subscription? You'll still have access until the end of your current billing period.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setConfirmCancel(false)}>
                                  Keep Subscription
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={handleCancelSubscription}
                                  disabled={isCanceling}
                                >
                                  {isCanceling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Yes, Cancel
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Failed to load subscription data. Please try again later.
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={fetchSubscription} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Refresh
                  </Button>
                  <Button variant="default" onClick={() => navigate('/pricing')}>
                    View Plans
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Name</h3>
                      <p className="text-muted-foreground">{currentUser.displayName || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Account created</h3>
                      <p className="text-muted-foreground">
                        {currentUser.metadata.creationTime 
                          ? new Date(currentUser.metadata.creationTime).toLocaleDateString() 
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" disabled>
                    Edit Profile (Coming Soon)
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-muted-foreground">
                        Last changed: Not available
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-muted-foreground">
                        Not enabled (Coming Soon)
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" disabled>
                    Change Password (Coming Soon)
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={logout}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Account;
