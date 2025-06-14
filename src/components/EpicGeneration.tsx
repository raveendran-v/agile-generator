
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, MessageSquare, RefreshCw, CheckCircle } from 'lucide-react';
import { Epic } from '../pages/Index';

interface EpicGenerationProps {
  epics: Epic[];
  isFinalized: boolean;
  isGenerating: boolean;
  onRegenerate: (feedback: string) => void;
  onFinalize: () => void;
}

const EpicGeneration: React.FC<EpicGenerationProps> = ({
  epics,
  isFinalized,
  isGenerating,
  onRegenerate,
  onFinalize
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleRegenerate = () => {
    if (!feedback.trim()) return;
    onRegenerate(feedback);
    setFeedback('');
    setShowFeedback(false);
  };

  const handleExport = () => {
    // Mock export functionality
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(epics, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'epics.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl font-serif text-stone-900 dark:text-stone-100">
          <span>Generated Epics</span>
          {isFinalized && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
        <CardDescription>
          {isFinalized 
            ? "Your epics are finalized and ready for user story generation."
            : "Review and refine your generated epics before proceeding."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Epic List */}
        <div className="space-y-4">
          {epics.map((epic, index) => (
            <div
              key={epic.id}
              className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                    {epic.epic_name}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {epic.epic_description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex items-center justify-center space-x-2 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800"></div>
            <span className="text-stone-600 dark:text-stone-400">
              Regenerating epics based on your feedback...
            </span>
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && !isFinalized && (
          <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg border">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Provide feedback for regeneration:
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what changes you'd like to see in the epics..."
              rows={3}
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleRegenerate}
                disabled={!feedback.trim() || isGenerating}
                size="sm"
                className="bg-amber-800 hover:bg-amber-700"
              >
                Apply Feedback
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isFinalized && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFeedback(!showFeedback)}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onRegenerate('')}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate</span>
            </Button>
            
            <Button
              onClick={onFinalize}
              disabled={isGenerating}
              className="bg-green-700 hover:bg-green-600 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Finalize</span>
            </Button>
          </div>
        )}

        {/* Export Button */}
        {isFinalized && (
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-500 flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Export as .docx</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EpicGeneration;
