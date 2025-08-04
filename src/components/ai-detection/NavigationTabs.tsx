import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BarChart3, BookOpen } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: {
    checkText: React.ReactNode;
    getReport: React.ReactNode;
    learnMore: React.ReactNode;
  };
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  children 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="check-text" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Check Text
        </TabsTrigger>
        <TabsTrigger value="get-report" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Get Report
        </TabsTrigger>
        <TabsTrigger value="learn-more" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Learn More
        </TabsTrigger>
      </TabsList>

      <TabsContent value="check-text" className="space-y-6">
        {children.checkText}
      </TabsContent>

      <TabsContent value="get-report" className="space-y-6">
        {children.getReport}
      </TabsContent>

      <TabsContent value="learn-more" className="space-y-6">
        {children.learnMore}
      </TabsContent>
    </Tabs>
  );
};

export default NavigationTabs;