import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface DetectionChartProps {
  aiProbability: number;
  confidenceLevel: string;
}

const DetectionChart: React.FC<DetectionChartProps> = ({ aiProbability, confidenceLevel }) => {
  // Create data for the chart
  const data = [
    { name: 'Human-like', value: Math.max(0, 100 - aiProbability), color: '#22c55e' },
    { name: 'AI-generated', value: aiProbability, color: '#ef4444' }
  ];

  // Confidence data
  const confidenceData = [
    { name: 'Low', value: confidenceLevel === 'Low' ? 100 : 0, color: '#f59e0b' },
    { name: 'Medium', value: confidenceLevel === 'Medium' ? 100 : 0, color: '#f59e0b' },
    { name: 'High', value: confidenceLevel === 'High' ? 100 : 0, color: '#10b981' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {`${payload[0].value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Probability Distribution Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            Detection Probability
          </CardTitle>
          <CardDescription>
            Distribution of human vs AI likelihood
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Probability Meter */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Human-like</span>
              <span>AI-generated</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${aiProbability}%`,
                  background: `linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)`
                }}
              />
            </div>
            <div className="text-center">
              <span className="text-lg font-bold">
                {aiProbability.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                AI probability
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Level Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4" />
            Confidence Level
          </CardTitle>
          <CardDescription>
            Model confidence in the analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={confidenceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Confidence Indicator */}
          <div className="mt-4 text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
              confidenceLevel === 'High' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : confidenceLevel === 'Medium'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              <Activity className="w-4 h-4" />
              {confidenceLevel} Confidence
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionChart;