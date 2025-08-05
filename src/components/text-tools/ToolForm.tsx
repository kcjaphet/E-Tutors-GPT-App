
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import LanguageSelect from './LanguageSelect';
import ToneSelect from './ToneSelect';
import ToolFormResult from './ToolFormResult';
import { ToolFormProps } from './types';

const ToolForm: React.FC<ToolFormProps> = ({
  selectedTool,
  tools,
  inputText,
  outputText,
  isProcessing,
  language,
  tone,
  setInputText,
  setLanguage,
  setTone,
  handleSubmit
}) => {
  const { t } = useTranslation();
  
  const onCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="inputText" className="text-sm font-medium">
            {t('tools.inputLabel')}
          </label>
          <div className="text-xs text-muted-foreground">
            {inputText.length} {t('tools.charactersCount')}
          </div>
        </div>
        <textarea
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-40 p-4 rounded-md border border-input bg-background focus-ring resize-none"
          placeholder="Type or paste your text here..."
        />
        
        {selectedTool === 'translate' && (
          <LanguageSelect language={language} setLanguage={setLanguage} />
        )}
        
        {selectedTool === 'tone' && (
          <ToneSelect tone={tone} setTone={setTone} />
        )}
        
        <button
          type="submit"
          disabled={!inputText || isProcessing}
          className={cn(
            "w-full h-10 rounded-md flex items-center justify-center text-sm font-medium transition-all duration-200 focus-ring",
            isProcessing || !inputText
              ? "bg-primary/70 text-primary-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('tools.processing')}
            </>
          ) : (
            <>
              {tools.find(tool => tool.id === selectedTool)?.title || t('tools.processText')}
            </>
          )}
        </button>
      </div>
      
      {outputText && <ToolFormResult outputText={outputText} onCopy={onCopy} />}
    </form>
  );
};

export default ToolForm;
