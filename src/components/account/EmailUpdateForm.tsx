
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface EmailUpdateFormProps {
  currentEmail: string;
}

const EmailUpdateForm: React.FC<EmailUpdateFormProps> = ({ currentEmail }) => {
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Feature not available",
      description: "Changing email functionality is not currently implemented.",
      variant: "default"
    });
  };

  return (
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
          <Button type="submit" disabled={loading || email === currentEmail}>
            {loading ? 'Updating...' : 'Update Email'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmailUpdateForm;
