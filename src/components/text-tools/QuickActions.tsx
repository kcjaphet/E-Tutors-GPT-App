import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Share2, RotateCcw, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  text: string;
  onClear: () => void;
  onCopy: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ text, onClear, onCopy }) => {
  const { toast } = useToast();

  const downloadAsText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpt-text-tools-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Text file has been downloaded"
    });
  };

  const shareText = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GPT Text Tools Result',
          text: text
        });
      } catch (error) {
        // Fallback to clipboard if sharing fails
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard",
          description: "Text has been copied for sharing"
        });
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard", 
        description: "Text has been copied for sharing"
      });
    }
  };

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Statistics */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold">{wordCount}</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{charCount}</div>
            <div className="text-xs text-muted-foreground">Characters</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={onCopy} className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          
          <Button variant="outline" size="sm" onClick={downloadAsText} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          
          <Button variant="outline" size="sm" onClick={shareText} className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          
          <Button variant="outline" size="sm" onClick={onClear} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;