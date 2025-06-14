
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileDown, MessageSquare, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { Epic } from '../pages/Index';

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
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(allEpics, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'epics.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEpicToggle = (epicId: string, checked: boolean) => {
    if (checked) {
      onEpicSelectionChange([...selectedEpicIds, epicId]);
    } else {
      onEpicSelectionChange(selectedEpicIds.filter(id => id !== epicId));
    }
  };

  const handleSelectAll = () => {
    if (selectedEpicIds.length === epics.length) {
      onEpicSelectionChange([]);
    } else {
      onEpicSelectionChange(epics.map(epic => epic.id));
    }
  };

  const completedCount = epicsWithStories.size;
  const totalCount = allEpics.length;
  const availableCount = epics.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl font-serif text-stone-900 dark:text-stone-100">
          <span>Epic Selection</span>
          {isFinalized && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
        <CardDescription>
          {isFinalized 
            ? "Selected epics are ready for user story generation."
            : "Select epics to generate user stories for this iteration."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Information */}
        {totalCount > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Progress Overview</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">{completedCount}</div>
                <div className="text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{availableCount}</div>
                <div className="text-gray-600 dark:text-gray-400">Available</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">{totalCount}</div>
                <div className="text-gray-600 dark:text-gray-400">Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Select All Toggle */}
        {!isFinalized && availableCount > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border">
            <Checkbox
              id="select-all"
              checked={selectedEpicIds.length === epics.length}
              onCheckedChange={handleSelectAll}
            />
            <label 
              htmlFor="select-all" 
              className="text-sm font-medium text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              Select All Available Epics ({selectedEpicIds.length} of {availableCount} selected)
            </label>
          </div>
        )}

        {/* Epic List */}
        <div className="space-y-4">
          {availableCount === 0 ? (
            <div className="text-center py-8 text-stone-500 dark:text-stone-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">All Epics Complete!</h3>
              <p>All epics have user stories generated. You can export your complete project.</p>
            </div>
          ) : (
            epics.map((epic, index) => (
              <div
                key={epic.id}
                className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
              >
                <div className="flex items-start space-x-3">
                  {!isFinalized && (
                    <div className="flex-shrink-0 pt-1">
                      <Checkbox
                        id={`epic-${epic.id}`}
                        checked={selectedEpicIds.includes(epic.id)}
                        onCheckedChange={(checked) => handleEpicToggle(epic.id, checked as boolean)}
                      />
                    </div>
                  )}
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {allEpics.findIndex(e => e.id === epic.id) + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                        {epic.epic_name}
                      </h3>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {epic.epic_description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
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
              disabled={isGenerating || selectedEpicIds.length === 0}
              className="bg-green-700 hover:bg-green-600 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Proceed with Selected ({selectedEpicIds.length})</span>
            </Button>
          </div>
        )}

        {/* Export Button */}
        {availableCount === 0 && (
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-500 flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Export All Epics</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EpicGeneration;
