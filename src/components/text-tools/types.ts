
import { ReactNode } from 'react';

export type Tool = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  prompt: string;
  linkTo?: string;
};

export type TextToolsProps = {
  selectedTool?: string | null;
  onToolSelect?: (toolId: string) => void;
};

export type ToolsGridProps = {
  tools: Tool[];
  onToolSelect: (toolId: string) => void;
  selectedTool: string | null;
};

export type ToolFormProps = {
  selectedTool: string | null;
  tools: Tool[];
  inputText: string;
  outputText: string;
  isProcessing: boolean;
  language: string;
  tone: string;
  setInputText: (text: string) => void;
  setLanguage: (language: string) => void;
  setTone: (tone: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export type ToolFormResultProps = {
  outputText: string;
  onCopy: () => void;
};

export type LanguageSelectProps = {
  language: string;
  setLanguage: (language: string) => void;
};

export type ToneSelectProps = {
  tone: string;
  setTone: (tone: string) => void;
};
