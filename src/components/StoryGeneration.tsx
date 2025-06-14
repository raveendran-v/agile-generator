
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, MessageSquare, RefreshCw, CheckCircle, Play } from 'lucide-react';
import { Story, Epic } from '../pages/Index';

interface StoryGenerationProps {
  stories: Story[];
  epics: Epic[];
  isFinalized: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onRegenerate: (feedback: string) => void;
  onFinalize: () => void;
}

const StoryGeneration: React.FC<StoryGenerationProps> = ({
  stories,
  epics,
  isFinalized,
  isGenerating,
  onGenerate,
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
    const file = new Blob([JSON.stringify(stories, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'user-stories.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getEpicName = (epicId: string) => {
    return epics.find(epic => epic.id === epicId)?.epic_name || 'Unknown Epic';
  };

  if (stories.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-stone-900 dark:text-stone-100">
            User Story Generation
          </CardTitle>
          <CardDescription>
            Generate detailed user stories from your finalized epics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-amber-800 hover:bg-amber-700 flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Generate User Stories</span>
          </Button>
          
          {isGenerating && (
            <div className="flex items-center justify-center space-x-2 py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800"></div>
              <span className="text-stone-600 dark:text-stone-400">
                Generating user stories from your epics...
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl font-serif text-stone-900 dark:text-stone-100">
          <span>Generated User Stories</span>
          {isFinalized && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
        <CardDescription>
          {isFinalized 
            ? "Your user stories are finalized and ready for export."
            : "Review and refine your generated user stories."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Story List */}
        <div className="space-y-6">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="p-6 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
            >
              <div className="space-y-4">
                {/* Story Header */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 pr-4">
                    {story.story_name}
                  </h3>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">{story.label}</Badge>
                    <Badge variant="outline">{story.status}</Badge>
                  </div>
                </div>

                {/* Epic Reference */}
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Epic: {getEpicName(story.epicId)}
                </p>

                {/* Description */}
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {story.description}
                </p>

                {/* Acceptance Criteria */}
                <div className="space-y-2">
                  <h4 className="font-medium text-stone-900 dark:text-stone-100">
                    Acceptance Criteria:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-stone-600 dark:text-stone-400">
                    {story.acceptance_criteria.map((criteria, idx) => (
                      <li key={idx}>{criteria}</li>
                    ))}
                  </ul>
                </div>

                {/* NFRs */}
                <div className="space-y-2">
                  <h4 className="font-medium text-stone-900 dark:text-stone-100">
                    Non-Functional Requirements:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-stone-600 dark:text-stone-400">
                    {story.nfrs.map((nfr, idx) => (
                      <li key={idx}>{nfr}</li>
                    ))}
                  </ul>
                </div>

                {/* DoD and DoR */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-stone-900 dark:text-stone-100">
                      Definition of Done:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-stone-600 dark:text-stone-400">
                      {story.dod.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-stone-900 dark:text-stone-100">
                      Definition of Ready:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-stone-600 dark:text-stone-400">
                      {story.dor.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
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
              Regenerating user stories based on your feedback...
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
              placeholder="Describe what changes you'd like to see in the user stories..."
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

export default StoryGeneration;
