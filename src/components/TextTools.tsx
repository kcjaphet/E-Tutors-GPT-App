import React, { useState } from 'react';
import ToolCard from './ToolCard';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Icons
import {
  MessageSquare,
  Languages,
  FileText,
  Highlighter,
  Pencil,
  Wand2,
  RefreshCw,
  ArrowUp,
  Check,
  BookText
} from 'lucide-react';

type Tool = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  linkTo?: string;
};

const tools: Tool[] = [
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Condense your text into a concise summary',
    icon: <FileText className="w-5 h-5" />,
    prompt: 'Summarize the following text:'
  },
  {
    id: 'paraphrase',
    title: 'Paraphrase',
    description: 'Rewrite your text while keeping its meaning',
    icon: <RefreshCw className="w-5 h-5" />,
    prompt: 'Paraphrase the following text:'
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Translate your text to another language',
    icon: <Languages className="w-5 h-5" />,
    prompt: 'Translate the following text to '
  },
  {
    id: 'grammar',
    title: 'Fix Grammar',
    description: 'Correct grammatical errors in your text',
    icon: <Pencil className="w-5 h-5" />,
    prompt: 'Fix the grammar in the following text:'
  },
  {
    id: 'tone',
    title: 'Adjust Tone',
    description: 'Change the tone of your text',
    icon: <MessageSquare className="w-5 h-5" />,
    prompt: 'Adjust the tone of the following text to be '
  },
  {
    id: 'enhance',
    title: 'Enhance',
    description: 'Improve the quality of your writing',
    icon: <Wand2 className="w-5 h-5" />,
    prompt: 'Enhance the following text to make it more professional:'
  },
  {
    id: 'literature-review',
    title: 'Literature Review',
    description: 'Generate a structured literature review',
    icon: <BookText className="w-5 h-5" />,
    linkTo: '/literature-review',
    prompt: ''
  },
];

const TextTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('Spanish');
  const [tone, setTone] = useState<string>('professional');

  const handleToolSelect = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    
    if (tool?.linkTo) {
      // If the tool has a link, we don't need to select it
      return;
    }
    
    setSelectedTool(toolId);
    setOutputText('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText || !selectedTool) return;
    
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real implementation, this would be an API call to your backend
      const tool = tools.find(t => t.id === selectedTool);
      let result = '';
      
      if (tool) {
        switch (selectedTool) {
          case 'summarize':
            result = `This is a summarized version of your text. It's designed to be concise while retaining the key points of the original passage.`;
            break;
          case 'paraphrase':
            result = `This is a paraphrased version of your text. The meaning remains the same, but the words and structure have been changed.`;
            break;
          case 'translate':
            result = `This is your text translated to ${language}. In a real implementation, this would be an actual translation.`;
            break;
          case 'grammar':
            result = `This is your text with grammar errors corrected. Any grammatical issues in the original text have been fixed.`;
            break;
          case 'tone':
            result = `This is your text with the tone adjusted to be more ${tone}. The content is the same, but the way it's expressed has been modified.`;
            break;
          case 'enhance':
            result = `This is an enhanced version of your text. It's more professional, clear, and effective than the original.`;
            break;
          default:
            result = 'Tool not implemented yet.';
        }
      }
      
      setOutputText(result);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <section className="container px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-4">Powerful Text Tools</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a tool and enter your text to see the magic happen. Our AI-powered tools help you transform your text in seconds.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tools.map((tool) => (
          tool.linkTo ? (
            <Link to={tool.linkTo} key={tool.id}>
              <ToolCard
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                onClick={() => {}}
                isSelected={false}
              />
            </Link>
          ) : (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onClick={() => handleToolSelect(tool.id)}
              isSelected={selectedTool === tool.id}
            />
          )
        ))}
      </div>
      
      {selectedTool && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="inputText" className="text-sm font-medium">
                Enter your text
              </label>
              <div className="text-xs text-muted-foreground">
                {inputText.length} characters
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
              <div className="flex items-center gap-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Translate to:
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-ring"
                >
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
            )}
            
            {selectedTool === 'tone' && (
              <div className="flex items-center gap-2">
                <label htmlFor="tone" className="text-sm font-medium">
                  Adjust tone to:
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-ring"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>
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
                  Processing...
                </>
              ) : (
                <>
                  {tools.find(t => t.id === selectedTool)?.title || 'Process'} Text
                </>
              )}
            </button>
          </div>
          
          {outputText && (
            <div className="space-y-4 animate-in slide-up">
              <div className="flex items-center justify-between">
                <label htmlFor="outputText" className="text-sm font-medium">
                  Result
                </label>
                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-secondary focus-ring"
                  onClick={() => {
                    navigator.clipboard.writeText(outputText);
                  }}
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
          )}
        </form>
      )}
    </section>
  );
};

export default TextTools;
