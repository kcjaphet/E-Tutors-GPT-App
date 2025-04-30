
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { currentUser, updateEmail, updatePassword, deleteAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || email === currentUser?.email) return;
    
    try {
      setLoading(true);
      await updateEmail(email);
      toast({
        title: "Email updated",
        description: "Your email has been successfully updated."
      });
    } catch (error) {
      console.error('Failed to update email:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update email"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) return;
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match."
      });
      return;
    }
    
    try {
      setLoading(true);
      await updatePassword(password);
      setPassword('');
      setConfirmPassword('');
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update password"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast({
        variant: "destructive",
        title: "Confirmation required",
        description: "Please type DELETE to confirm account deletion."
      });
      return;
    }
    
    try {
      setLoading(true);
      await deleteAccount();
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted."
      });
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete your account"
      });
      setLoading(false);
    }
  };
  
  // Redirect if not signed in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="space-y-8">
            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>View your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-muted-foreground">
                    {currentUser.metadata && new Date(parseInt(currentUser.metadata.creationTime)).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Sign In</p>
                  <p className="text-muted-foreground">
                    {currentUser.metadata && new Date(parseInt(currentUser.metadata.lastSignInTime)).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Update Email Card */}
            <Card>
              <CardHeader>
                <CardTitle>Update Email</CardTitle>
                <CardDescription>Change the email address associated with your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">New Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading || email === currentUser.email}>
                    {loading ? 'Updating...' : 'Update Email'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Update Password Card */}
            <Card>
              <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                      minLength={6}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading || !password || password !== confirmPassword}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Delete Account Card */}
            <Card className="border-destructive/50">
              <CardHeader className="text-destructive">
                <CardTitle>Delete Account</CardTitle>
                <CardDescription className="text-destructive/80">
                  Permanently delete your account and all your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </p>
                <div className="space-y-2">
                  <label htmlFor="deleteConfirm" className="text-sm font-medium">Type DELETE to confirm</label>
                  <input
                    type="text"
                    id="deleteConfirm"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="w-full p-2 border rounded-md border-destructive/50"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  disabled={loading || deleteConfirm !== 'DELETE'} 
                  onClick={handleDeleteAccount}
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
