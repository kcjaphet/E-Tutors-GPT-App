
import React from 'react';
import { Check } from 'lucide-react';
import { ToolFormResultProps } from './types';

const ToolFormResult: React.FC<ToolFormResultProps> = ({ outputText, onCopy }) => {
  return (
    <div className="space-y-4 animate-in slide-up">
      <div className="flex items-center justify-between">
        <label htmlFor="outputText" className="text-sm font-medium">
          Result
        </label>
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-secondary focus-ring"
          onClick={onCopy}
        >
          <Check className="mr-2 h-3 w-3" />
          Copy to clipboard
        </button>
      </div>
      <div 
        className="w-full min-h-40 p-4 rounded-md border border-input bg-background"
      >
        <p className="whitespace-pre-wrap">{outputText}</p>
      </div>
    </div>
  );
};

export default ToolFormResult;
