
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  readOnly?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  loading = false,
  readOnly = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div
      className={`relative w-full rounded-lg border transition-all duration-200 ${
        isFocused ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}
      
      <div className="flex items-center border-b px-3 py-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full h-64 p-4 bg-transparent resize-none focus:outline-none"
        readOnly={readOnly}
      />
      
      <div className="flex justify-between items-center px-4 py-2 text-xs text-muted-foreground border-t">
        <span>{value.length} characters</span>
        <span>{value.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
};

export default TextEditor;
