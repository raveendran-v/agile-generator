
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileDown, MessageSquare, RefreshCw, CheckCircle, Info, Play } from 'lucide-react';
import { Epic } from '../pages/Index';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import WorkflowProgress from './WorkflowProgress';

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
    element.download = 'project-epics.docx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const completedCount = epicsWithStories.size;
  const totalCount = allEpics.length;
  const availableCount = epics.length;

  // Calculate stories per epic
  const storiesPerEpic = allStories.reduce((acc, story) => {
    acc[story.epicId] = (acc[story.epicId] || 0) + 1;
    return acc;
  }, {} as { [epicId: string]: number });

  const totalStories = allStories.length;

  return (
    <Card className="w-full shadow-modern card-enhanced">
      <CardHeader className="bg-gradient-to-r from-card to-muted/30 dark:from-card/90 dark:to-muted/20 border-b border-border/50 dark:border-border/60">
        <CardTitle className="flex items-center space-x-2 text-xl font-serif text-enhanced">
          <span>Epic Management</span>
          {isFinalized && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
        </CardTitle>
        <CardDescription className="text-enhanced-muted">
          {isFinalized 
            ? "Epics are finalized. Select an epic to generate user stories."
            : "Review and finalize your epics before generating user stories."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Modern Progress Component */}
        {totalCount > 0 && (
          <WorkflowProgress 
            totalEpics={totalCount}
            completedEpics={completedCount}
            availableEpics={availableCount}
            totalStories={totalStories}
            storiesPerEpic={storiesPerEpic}
          />
        )}

        {/* Epic List */}
        <div className="space-y-4">
          {availableCount === 0 ? (
            <div className="text-center py-8 text-enhanced-muted">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 dark:text-green-400" />
              <h3 className="font-semibold mb-2 text-enhanced">All Epics Complete!</h3>
              <p>All epics have user stories generated. You can export your complete project.</p>
            </div>
          ) : (
            epics.map((epic, index) => (
              <div
                key={epic.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-lg card-enhanced hover:border-border/80 dark:hover:border-border/90`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-800/90 dark:bg-amber-700/90 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                    {allEpics.findIndex(e => e.id === epic.id) + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-enhanced">
                        {epic.epic_name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-500/60 bg-orange-50 dark:bg-orange-900/20">
                          Pending
                        </Badge>
                        {isFinalized && (
                          <Button 
                            size="sm" 
                            className="bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 btn-dark-enhanced text-white"
                            onClick={() => handleGenerateStory(epic.id)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Generate Story
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-enhanced-muted leading-relaxed">
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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800 dark:border-amber-400"></div>
            <span className="text-enhanced-muted">
              Regenerating epics based on your feedback...
            </span>
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && !isFinalized && (
          <div className="space-y-3 p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border/50 dark:border-border/60">
            <label className="text-sm font-medium text-enhanced">
              Provide feedback for regeneration:
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what changes you'd like to see in the epics..."
              rows={3}
              className="input-enhanced"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleRegenerate}
                disabled={!feedback.trim() || isGenerating}
                size="sm"
                className="bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 btn-dark-enhanced text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedback(false)}
                className="hover-enhanced border-border/60 dark:border-border/70"
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
              className="flex items-center space-x-2 hover-enhanced border-border/60 dark:border-border/70"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </Button>
            
            <Button
              onClick={onFinalize}
              disabled={isGenerating}
              className="bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 flex items-center space-x-2 btn-dark-enhanced text-white"
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
            className="bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 flex items-center space-x-2 btn-dark-enhanced text-white"
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
