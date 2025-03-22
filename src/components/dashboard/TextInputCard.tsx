
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Bot, User, RefreshCw, Upload } from 'lucide-react';
import TextEditor from '@/components/TextEditor';

interface TextInputCardProps {
  inputText: string;
  handleTextChange: (value: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  detectAIText: () => void;
  humanizeText: () => void;
  isDetecting: boolean;
  isHumanizing: boolean;
  remainingDetections: number | string;
  remainingHumanizations: number | string;
  subscriptionType: string | undefined;
}

const TextInputCard: React.FC<TextInputCardProps> = ({
  inputText,
  handleTextChange,
  handleFileUpload,
  detectAIText,
  humanizeText,
  isDetecting,
  isHumanizing,
  remainingDetections,
  remainingHumanizations,
  subscriptionType
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Text Input
        </CardTitle>
        <CardDescription>
          Paste your text below or upload a text file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TextEditor 
          value={inputText} 
          onChange={handleTextChange} 
          placeholder="Paste or type your text here..." 
        />
        
        <div className="mt-4">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Upload className="w-4 h-4" />
              Upload text file
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button 
          onClick={detectAIText} 
          disabled={
            isDetecting || 
            isHumanizing || 
            !inputText.trim() || 
            (subscriptionType === 'free' && typeof remainingDetections === 'number' && remainingDetections <= 0)
          }
          className="flex items-center gap-2"
        >
          {isDetecting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
          {isDetecting ? "Detecting..." : "Detect AI Text"}
          {subscriptionType === 'free' && typeof remainingDetections === 'number' && (
            <span className="ml-1 text-xs opacity-80">({remainingDetections} left)</span>
          )}
        </Button>
        <Button 
          onClick={humanizeText} 
          disabled={
            isDetecting || 
            isHumanizing || 
            !inputText.trim() || 
            (subscriptionType === 'free' && typeof remainingHumanizations === 'number' && remainingHumanizations <= 0)
          }
          className="flex items-center gap-2"
          variant="outline"
        >
          {isHumanizing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <User className="w-4 h-4" />
          )}
          {isHumanizing ? "Humanizing..." : "Humanize Text"}
          {subscriptionType === 'free' && typeof remainingHumanizations === 'number' && (
            <span className="ml-1 text-xs opacity-80">({remainingHumanizations} left)</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextInputCard;
