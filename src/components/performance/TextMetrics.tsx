import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, TrendingUp, Users } from 'lucide-react';

interface TextMetricsProps {
  text: string;
}

const TextMetrics: React.FC<TextMetricsProps> = ({ text }) => {
  // Calculate reading metrics
  const words = text.split(/\s+/).filter(Boolean).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
  
  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(words / 200);
  
  // Calculate readability score (simplified Flesch Reading Ease)
  const averageWordsPerSentence = sentences > 0 ? words / sentences : 0;
  const averageSyllablesPerWord = words > 0 ? charactersNoSpaces / words * 1.2 : 0; // rough estimate
  const fleschScore = Math.max(0, Math.min(100, 
    206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord)
  ));
  
  // Determine readability level
  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: 'Very Easy', color: 'bg-green-500' };
    if (score >= 80) return { level: 'Easy', color: 'bg-green-400' };
    if (score >= 70) return { level: 'Fairly Easy', color: 'bg-yellow-400' };
    if (score >= 60) return { level: 'Standard', color: 'bg-yellow-500' };
    if (score >= 50) return { level: 'Fairly Difficult', color: 'bg-orange-400' };
    if (score >= 30) return { level: 'Difficult', color: 'bg-red-400' };
    return { level: 'Very Difficult', color: 'bg-red-500' };
  };
  
  const readabilityInfo = getReadabilityLevel(fleschScore);
  
  const metrics = [
    {
      title: 'Words',
      value: words.toLocaleString(),
      icon: <BookOpen className="w-4 h-4" />,
      description: 'Total word count'
    },
    {
      title: 'Reading Time',
      value: `${readingTime} min`,
      icon: <Clock className="w-4 h-4" />,
      description: 'Average reading time'
    },
    {
      title: 'Sentences',
      value: sentences.toString(),
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Total sentences'
    },
    {
      title: 'Paragraphs',
      value: paragraphs.toString(),
      icon: <Users className="w-4 h-4" />,
      description: 'Total paragraphs'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Metrics</CardTitle>
        <CardDescription>Detailed analysis of your text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                {metric.icon}
              </div>
              <div>
                <div className="font-semibold">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.title}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Readability Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Readability Score</span>
            <Badge variant="secondary" className="font-medium">
              {Math.round(fleschScore)}/100
            </Badge>
          </div>
          <Progress value={fleschScore} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Reading Level:</span>
            <Badge className={`text-white ${readabilityInfo.color}`}>
              {readabilityInfo.level}
            </Badge>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Characters:</span>
            <span>{characters.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Without spaces:</span>
            <span>{charactersNoSpaces.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg words/sentence:</span>
            <span>{averageWordsPerSentence.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Complexity:</span>
            <span>{averageWordsPerSentence > 20 ? 'High' : averageWordsPerSentence > 15 ? 'Medium' : 'Low'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextMetrics;