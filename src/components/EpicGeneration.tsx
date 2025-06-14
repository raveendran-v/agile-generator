
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, MessageSquare, RefreshCw, CheckCircle } from 'lucide-react';
import { Epic } from '../pages/Index';
import WorkflowProgress from './WorkflowProgress';
import EpicCard from './EpicCard';
import { exportEpicsToDocx } from '@/utils/exportUtils';

interface EpicGenerationProps {
  epics: Epic[];
  allEpics: Epic[];
  epicsWithStories: Set<string>;
  isFinalized: boolean;
  isGenerating: boolean;
  selectedEpicIds: string[];
  onEpicSelectionChange: (epicIds: string[]) => void;
  onRegenerate: (feedback: string) => void;
  onFinalize: () => void;
  onSelectEpic?: (epicId: string) => void;
  onGenerateStoriesForEpic?: (epicId: string) => void;
  allStories?: any[];
}

const EpicGeneration: React.FC<EpicGenerationProps> = ({
  epics,
  allEpics,
  epicsWithStories,
  isFinalized,
  isGenerating,
  selectedEpicIds,
  onEpicSelectionChange,
  onRegenerate,
  onFinalize,
  onSelectEpic,
  onGenerateStoriesForEpic,
  allStories = []
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleRegenerate = () => {
    if (!feedback.trim()) return;
    onRegenerate(feedback);
    setFeedback('');
    setShowFeedback(false);
  };

  const handleGenerateStory = (epicId: string) => {
    if (onGenerateStoriesForEpic) {
      onGenerateStoriesForEpic(epicId);
    } else if (onSelectEpic) {
      onSelectEpic(epicId);
    }
  };

  const handleExport = async () => {
    await exportEpicsToDocx(allEpics, epicsWithStories);
  };

  const completedCount = epicsWithStories.size;
  const totalCount = allEpics.length;
  const availableCount = epics.length;

  const storiesPerEpic = allStories.reduce((acc, story) => {
    acc[story.epicId] = (acc[story.epicId] || 0) + 1;
    return acc;
  }, {} as { [epicId: string]: number });

  const totalStories = allStories.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl font-serif text-stone-900 dark:text-stone-100">
          <span>Epic Management</span>
          {isFinalized && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
        <CardDescription>
          {isFinalized 
            ? "Epics are finalized. Select an epic to generate user stories."
            : "Review and finalize your epics before generating user stories."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalCount > 0 && (
          <WorkflowProgress 
            totalEpics={totalCount}
            completedEpics={completedCount}
            availableEpics={availableCount}
            totalStories={totalStories}
            storiesPerEpic={storiesPerEpic}
          />
        )}

        <div className="space-y-4">
          {availableCount === 0 ? (
            <div className="text-center py-8 text-stone-500 dark:text-stone-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">All Epics Complete!</h3>
              <p>All epics have user stories generated. You can export your complete project.</p>
            </div>
          ) : (
            epics.map((epic, index) => (
              <EpicCard
                key={epic.id}
                epic={epic}
                index={allEpics.findIndex(e => e.id === epic.id)}
                isFinalized={isFinalized}
                onGenerateStory={handleGenerateStory}
              />
            ))
          )}
        </div>

        {isGenerating && (
          <div className="flex items-center justify-center space-x-2 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800"></div>
            <span className="text-stone-600 dark:text-stone-400">
              Regenerating epics based on your feedback...
            </span>
          </div>
        )}

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
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
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

        {!isFinalized && availableCount > 0 && (
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
              onClick={onFinalize}
              disabled={isGenerating}
              className="bg-green-700 hover:bg-green-600 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Finalize Epics</span>
            </Button>
          </div>
        )}

        {(availableCount === 0 || isFinalized) && (
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-500 flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Epics as DOCX</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EpicGeneration;
