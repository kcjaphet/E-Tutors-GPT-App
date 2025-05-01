
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DeleteAccountForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    toast({
      title: "Feature not available",
      description: "Account deletion functionality is not currently implemented.",
      variant: "default"
    });
  };

  return (
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
            className="w-full p-2 border rounded-md border-destructive/50"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          disabled={loading} 
          onClick={handleDeleteAccount}
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeleteAccountForm;
