
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface AccountInfoProps {
  email: string;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ email }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>View your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-muted-foreground">{email}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Account Created</p>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Last Sign In</p>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfo;
