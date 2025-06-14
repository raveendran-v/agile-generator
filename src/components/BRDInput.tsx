
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles } from 'lucide-react';

interface BRDInputProps {
  onSubmit: (content: string) => void;
  workflowStep: 'brd' | 'epics' | 'stories' | 'iteration-complete';
  isGeneratingEpics: boolean;
  isGeneratingStories: boolean;
}

const BRDInput: React.FC<BRDInputProps> = ({
  onSubmit,
  workflowStep,
  isGeneratingEpics,
  isGeneratingStories
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
    }
  };

  if (workflowStep !== 'brd') {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-serif text-stone-900 dark:text-stone-100">
          <FileText className="w-6 h-6" />
          <span>Business Requirements Document</span>
        </CardTitle>
        <CardDescription className="text-lg">
          Paste your BRD content to generate epics and user stories using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="brd-content" className="text-sm font-medium text-stone-700 dark:text-stone-300">
              BRD Content
            </label>
            <Textarea
              id="brd-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your Business Requirements Document content here..."
              rows={12}
              className="min-h-[300px] resize-y"
              disabled={isGeneratingEpics || isGeneratingStories}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!content.trim() || isGeneratingEpics || isGeneratingStories}
            className="w-full bg-amber-800 hover:bg-amber-700 text-white py-3 text-lg font-medium"
          >
            {isGeneratingEpics ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Epics...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Generate Epics with AI</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BRDInput;
