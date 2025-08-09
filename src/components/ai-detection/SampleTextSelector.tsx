import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleTexts, SampleText, getSamplesByCategory } from '@/data/sampleTexts';
import { User, Bot, FileText, Lightbulb, Code, PenTool } from 'lucide-react';

interface SampleTextSelectorProps {
  onSampleSelect: (text: string, expectedType: 'human' | 'ai') => void;
}

const SampleTextSelector: React.FC<SampleTextSelectorProps> = ({ onSampleSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<'essay' | 'article' | 'creative' | 'technical'>('essay');

  const getCategoryIcon = (category: SampleText['category']) => {
    switch (category) {
      case 'essay': return <FileText className="w-4 h-4" />;
      case 'creative': return <PenTool className="w-4 h-4" />;
      case 'technical': return <Code className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: SampleText['expectedType']) => {
    return type === 'human' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getTypeColor = (type: SampleText['expectedType']) => {
    return type === 'human' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Test Sample Texts
        </CardTitle>
        <CardDescription>
          Try our curated samples to see how the AI detector performs on different types of content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value as 'essay' | 'creative' | 'technical')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="essay" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Essays
            </TabsTrigger>
            <TabsTrigger value="creative" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Creative
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Technical
            </TabsTrigger>
          </TabsList>

          {(['essay', 'creative', 'technical'] as const).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-3">
                {getSamplesByCategory(category).map((sample) => (
                  <Card key={sample.id} className="border border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(sample.category)}
                          <h4 className="font-medium text-sm">{sample.title}</h4>
                        </div>
                        <Badge className={getTypeColor(sample.expectedType)}>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(sample.expectedType)}
                            {sample.expectedType === 'human' ? 'Human' : 'AI'}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {sample.text.length > 150 
                          ? `${sample.text.substring(0, 150)}...` 
                          : sample.text
                        }
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Source: {sample.source}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => onSampleSelect(sample.text, sample.expectedType)}
                          className="h-8"
                        >
                          Test This Sample
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SampleTextSelector;