
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface DetectionResult {
  aiProbability: number;
  confidenceLevel: string;
  analysis: string;
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
}

const ResultCard: React.FC<ResultCardProps> = ({
  resultText,
  detectionResult,
  humanizationResult,
  copyToClipboard,
  textCopied
}) => {
  if (!resultText) return null;

  return (
    <Card className="animate-in slide-in-from-bottom-4 duration-300">
      <CardHeader>
        <CardTitle>
          {detectionResult ? "AI Detection Results" : humanizationResult ? "Humanized Text" : "Results"}
        </CardTitle>
        {humanizationResult && (
          <CardDescription>
            Your text has been rewritten to sound more natural and human-like
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
          {resultText}
        </div>
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
