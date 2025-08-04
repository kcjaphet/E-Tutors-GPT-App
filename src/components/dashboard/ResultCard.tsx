
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, AlertTriangle, Shield, Brain } from 'lucide-react';
import DetectionChart from '@/components/ai-detection/DetectionChart';

interface DetectionResult {
  aiProbability: number;
  confidenceLevel: string;
  analysis: string;
  reasoning: string;
  highlightedSegments: string[];
  textLength: number;
  timestamp: string;
}

interface HumanizationResult {
  originalText: string;
  humanizedText: string;
  textLength: number;
  timestamp: string;
  note?: string;
}

interface ResultCardProps {
  resultText: string;
  detectionResult: DetectionResult | null;
  humanizationResult: HumanizationResult | null;
  copyToClipboard: () => void;
  textCopied: boolean;
  inputText?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  resultText,
  detectionResult,
  humanizationResult,
  copyToClipboard,
  textCopied,
  inputText
}) => {
  console.log('ResultCard render:', { detectionResult, humanizationResult, hasData: !!(detectionResult || humanizationResult) });
  if (!detectionResult && !humanizationResult) return null;

  // Helper function to highlight suspicious segments in text
  const highlightText = (text: string, segments: string[]) => {
    if (!segments || segments.length === 0) return text;
    
    let highlightedText = text;
    segments.forEach((segment) => {
      const regex = new RegExp(`(${segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-red-100 dark:bg-red-900/30 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  // Get probability color and icon based on percentage
  const getProbabilityStatus = (probability: number) => {
    if (probability <= 30) {
      return { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20', icon: Shield, label: 'Human-like' };
    } else if (probability <= 70) {
      return { color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/20', icon: AlertTriangle, label: 'Mixed' };
    } else {
      return { color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20', icon: Brain, label: 'AI-generated' };
    }
  };

  return (
    <Card className="animate-in slide-in-from-bottom-4 duration-300">
      <CardHeader>
        <CardTitle>
          {detectionResult ? "AI Detection Results" : humanizationResult ? "Humanized Text" : "Results"}
        </CardTitle>
        {detectionResult && (
          <CardDescription>
            Analysis completed with detailed reasoning and highlighted segments
          </CardDescription>
        )}
        {humanizationResult && (
          <CardDescription>
            Your text has been rewritten to sound more natural and human-like
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* AI Detection Results */}
        {detectionResult && (
          <>
            {/* Main Probability Display */}
            <div className={`p-6 rounded-lg border ${getProbabilityStatus(detectionResult.aiProbability).bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {React.createElement(getProbabilityStatus(detectionResult.aiProbability).icon, {
                    className: `w-6 h-6 ${getProbabilityStatus(detectionResult.aiProbability).color}`
                  })}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {detectionResult.aiProbability.toFixed(1)}% AI-generated
                    </h3>
                    <p className={`text-sm ${getProbabilityStatus(detectionResult.aiProbability).color}`}>
                      {getProbabilityStatus(detectionResult.aiProbability).label}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {detectionResult.confidenceLevel} Confidence
                </Badge>
              </div>
              
              {/* Analysis Summary */}
              <p className="text-sm text-muted-foreground mb-4">
                {detectionResult.analysis}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    detectionResult.aiProbability <= 30 ? 'bg-green-500' :
                    detectionResult.aiProbability <= 70 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${detectionResult.aiProbability}%` }}
                />
              </div>
            </div>

            {/* Chart Visualization */}
            <DetectionChart 
              aiProbability={detectionResult.aiProbability}
              confidenceLevel={detectionResult.confidenceLevel}
            />

            {/* Detailed Reasoning */}
            {detectionResult.reasoning && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Detailed Analysis
                </h4>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm leading-relaxed">{detectionResult.reasoning}</p>
                </div>
              </div>
            )}

            {/* Highlighted Segments */}
            {detectionResult.highlightedSegments && detectionResult.highlightedSegments.length > 0 && inputText && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Text with Highlighted Suspicious Segments
                </h4>
                <div 
                  className="bg-muted p-4 rounded-md text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(inputText, detectionResult.highlightedSegments)
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  <p>🔴 Highlighted segments may indicate AI-generated content</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Humanization Results */}
        {humanizationResult && (
          <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
            {resultText}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard}
          className="flex items-center gap-2"
        >
          {textCopied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to clipboard
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
