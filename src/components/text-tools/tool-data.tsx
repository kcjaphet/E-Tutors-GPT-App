
import React from 'react';
import { Tool } from './types';
import {
  MessageSquare,
  Languages,
  FileText,
  Pencil,
  Wand2,
  RefreshCw,
  BookText,
  Shield,
  User,
  FileUp
} from 'lucide-react';

export const tools: Tool[] = [
  {
    id: 'ai-detector',
    title: 'AI Detector',
    description: 'Detect if text was written by AI or a human',
    icon: <Shield className="w-5 h-5" />,
    linkTo: '/dashboard',
    prompt: ''
  },
  {
    id: 'ai-humanizer',
    title: 'AI Humanizer',
    description: 'Make AI-generated text read more like human writing',
    icon: <User className="w-5 h-5" />,
    linkTo: '/dashboard',
    prompt: ''
  },
  {
    id: 'pdf-summary',
    title: 'PDF Summary',
    description: 'Extract and summarize content from PDF files',
    icon: <FileUp className="w-5 h-5" />,
    linkTo: '/pdf-summary',
    prompt: ''
  },
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Condense your text into a concise summary',
    icon: <FileText className="w-5 h-5" />,
    linkTo: '',
    prompt: 'Summarize the following text:'
  },
  {
    id: 'paraphrase',
    title: 'Paraphrase',
    description: 'Rewrite your text while keeping its meaning',
    icon: <RefreshCw className="w-5 h-5" />,
    linkTo: '',
    prompt: 'Paraphrase the following text:'
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Translate your text to another language',
    icon: <Languages className="w-5 h-5" />,
    linkTo: '',
    prompt: 'Translate the following text to '
  },
  {
    id: 'grammar',
    title: 'Fix Grammar',
    description: 'Correct grammatical errors in your text',
    icon: <Pencil className="w-5 h-5" />,
    linkTo: '',
    prompt: 'Fix the grammar in the following text:'
  },
  {
    id: 'tone',
    title: 'Adjust Tone',
    description: 'Change the tone of your text',
    icon: <MessageSquare className="w-5 h-5" />,
    linkTo: '',
    prompt: 'Adjust the tone of the following text to be '
  },
  {
    id: 'enhance',
    title: 'Enhance',
    description: 'Improve the quality of your writing',
    icon: <Wand2 className="w-5 h-5" />,
    linkTo: '',
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
