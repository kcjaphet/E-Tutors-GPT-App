import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BarChart3, BookOpen, MousePointer } from 'lucide-react';

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
        <TabsTrigger value="check-text" className="flex items-center gap-2 text-lg font-bold">
          <Search className="w-5 h-5" />
          Check Text
        </TabsTrigger>
        <TabsTrigger 
          value="get-report" 
          className="flex items-center gap-2 text-lg font-bold relative text-red-600 data-[state=active]:text-red-700 data-[state=active]:bg-red-50 hover:text-red-700 hover:bg-red-50 border-red-200 data-[state=active]:border-red-300"
        >
          <BarChart3 className="w-5 h-5 text-red-600" />
          Get Report
          <div className="absolute -right-2 -top-1">
            <MousePointer 
              className="w-5 h-5 text-red-500"
              style={{ 
                transform: 'rotate(-15deg)',
                animation: 'pointing-motion 2s ease-in-out infinite, flash 3s infinite'
              }}
            />
          </div>
        </TabsTrigger>
        <TabsTrigger value="learn-more" className="flex items-center gap-2 text-lg font-bold">
          <BookOpen className="w-5 h-5" />
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