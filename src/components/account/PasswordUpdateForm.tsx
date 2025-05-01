
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PasswordUpdateForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Feature not available",
      description: "Password reset functionality is not currently implemented.",
      variant: "default"
    });
  };

  return (
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
              className="w-full p-2 border rounded-md"
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordUpdateForm;
