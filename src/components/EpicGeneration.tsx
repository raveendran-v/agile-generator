import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileDown, MessageSquare, RefreshCw, CheckCircle, Info, Play } from 'lucide-react';
import { Epic } from '../pages/Index';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

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
  onGenerateStoriesForEpic
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
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Project Epics",
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            text: `Generated on: ${new Date().toLocaleDateString()}`,
            spacing: { after: 400 },
          }),
          ...allEpics.flatMap((epic, index) => [
            new Paragraph({
              text: `Epic ${index + 1}: ${epic.epic_name}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Description: ", bold: true }),
                new TextRun({ text: epic.epic_description }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Status: ", bold: true }),
                new TextRun({ 
                  text: epicsWithStories.has(epic.id) ? "Completed" : "Pending",
                  color: epicsWithStories.has(epic.id) ? "00AA00" : "FF6600"
                }),
              ],
              spacing: { after: 400 },
            }),
          ])
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = 'epics.docx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const completedCount = epicsWithStories.size;
  const totalCount = allEpics.length;
  const availableCount = epics.length;

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
                className={`p-4 border rounded-lg transition-all ${
                  isFinalized 
                    ? 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {allEpics.findIndex(e => e.id === epic.id) + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                        {epic.epic_name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Pending
                        </Badge>
                        {isFinalized && (
                          <Button 
                            size="sm" 
                            className="bg-amber-800 hover:bg-amber-700"
                            onClick={() => handleGenerateStory(epic.id)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Generate Story
                          </Button>
                        )}
                      </div>
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
              onClick={onFinalize}
              disabled={isGenerating}
              className="bg-green-700 hover:bg-green-600 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Finalize Epics</span>
            </Button>
          </div>
        )}

        {/* Export Button */}
        {(availableCount === 0 || isFinalized) && (
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-500 flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Epics</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EpicGeneration;
