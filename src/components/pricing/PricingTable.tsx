
import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plan } from './PricingCard';

interface PricingTableProps {
  plans: Plan[];
}

const PricingTable: React.FC<PricingTableProps> = ({ plans }) => {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Compare Plans</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Feature</TableHead>
            {plans.map((plan) => (
              <TableHead key={plan.id}>{plan.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">AI Text Detection</TableCell>
            <TableCell>5 per month</TableCell>
            <TableCell>Unlimited</TableCell>
            <TableCell>Unlimited</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Text Humanization</TableCell>
            <TableCell>3 per month</TableCell>
            <TableCell>Unlimited</TableCell>
            <TableCell>Unlimited</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Save History</TableCell>
            <TableCell>
              <XIcon className="h-5 w-5 text-muted-foreground" />
            </TableCell>
            <TableCell>
              <CheckIcon className="h-5 w-5 text-green-500" />
            </TableCell>
            <TableCell>
              <CheckIcon className="h-5 w-5 text-green-500" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">API Access</TableCell>
            <TableCell>
              <XIcon className="h-5 w-5 text-muted-foreground" />
            </TableCell>
            <TableCell>1000 calls/month</TableCell>
            <TableCell>2000 calls/month</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Priority Support</TableCell>
            <TableCell>
              <XIcon className="h-5 w-5 text-muted-foreground" />
            </TableCell>
            <TableCell>
              <CheckIcon className="h-5 w-5 text-green-500" />
            </TableCell>
            <TableCell>
              <CheckIcon className="h-5 w-5 text-green-500" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Price</TableCell>
            <TableCell>$0</TableCell>
            <TableCell>$8.99/month (billed yearly)</TableCell>
            <TableCell>$11.99/month</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingTable;
