
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';
import { tools } from './text-tools/tool-data';
import ToolsGrid from './text-tools/ToolsGrid';
import ToolForm from './text-tools/ToolForm';

const TextTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('Spanish');
  const [tone, setTone] = useState<string>('professional');
  const { toast } = useToast();

  const handleToolSelect = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    
    if (tool?.linkTo && tool.linkTo !== '') {
      // If the tool has a non-empty link, we don't need to select it
      return;
    }
    
    setSelectedTool(toolId);
    setOutputText('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText || !selectedTool) return;
    
    setIsProcessing(true);
    
    try {
      // Prepare options based on the selected tool
      let options = {};
      
      if (selectedTool === 'translate') {
        options = { language };
      } else if (selectedTool === 'tone') {
        options = { tone };
      }
      
      // Make API call
      const response = await fetch(API_ENDPOINTS.TEXT_PROCESS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          operation: selectedTool,
          options
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to process text');
      }
      
      // Set the processed text
      setOutputText(responseData.data.processedText);
      
      toast({
        title: "Processing complete",
        description: `Your text has been successfully processed`
      });
      
    } catch (error) {
      console.error('Error processing text:', error);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="container px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-4">Powerful Text Tools</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a tool and enter your text to see the magic happen. Our AI-powered tools help you transform your text in seconds.
        </p>
      </div>
      
      <ToolsGrid 
        tools={tools}
        onToolSelect={handleToolSelect}
        selectedTool={selectedTool}
      />
      
      {selectedTool && (
        <ToolForm
          selectedTool={selectedTool}
          tools={tools}
          inputText={inputText}
          outputText={outputText}
          isProcessing={isProcessing}
          language={language}
          tone={tone}
          setInputText={setInputText}
          setLanguage={setLanguage}
          setTone={setTone}
          handleSubmit={handleSubmit}
        />
      )}
    </section>
  );
};

export default TextTools;
