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
    <Card className="w-full bg-white/80 backdrop-blur-sm border-tech-border shadow-lg">
      <CardHeader className="bg-gradient-to-r from-tech-navy to-tech-pink text-white">
        <CardTitle className="flex items-center space-x-2 text-xl font-serif">
          <span>Epic Management</span>
          {isFinalized && <CheckCircle className="w-5 h-5 text-green-300" />}
        </CardTitle>
        <CardDescription className="text-blue-100">
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
            <div className="text-center py-8 text-tech-text-light">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2 text-tech-navy">All Epics Complete!</h3>
              <p>All epics have user stories generated. You can export your complete project.</p>
            </div>
          ) : (
            epics.map((epic, index) => (
              <div
                key={epic.id}
                className="p-4 border border-tech-border rounded-lg transition-all bg-gradient-to-r from-white to-tech-content/50 hover:shadow-md"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-tech-navy to-tech-pink text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {allEpics.findIndex(e => e.id === epic.id) + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-tech-navy">
                        {epic.epic_name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-tech-orange border-tech-orange">
                          Pending
                        </Badge>
                        {isFinalized && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-tech-pink to-tech-orange hover:from-tech-pink/80 hover:to-tech-orange/80 text-white"
                            onClick={() => handleGenerateStory(epic.id)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Generate Story
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-tech-text-light leading-relaxed">
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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tech-pink"></div>
            <span className="text-tech-text-light">
              Regenerating epics based on your feedback...
            </span>
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && !isFinalized && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-tech-content to-blue-50 rounded-lg border border-tech-border">
            <label className="text-sm font-medium text-tech-navy">
              Provide feedback for regeneration:
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what changes you'd like to see in the epics..."
              rows={3}
              className="border-tech-border focus:border-tech-pink"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleRegenerate}
                disabled={!feedback.trim() || isGenerating}
                size="sm"
                className="bg-gradient-to-r from-tech-navy to-tech-pink hover:from-tech-navy/80 hover:to-tech-pink/80 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedback(false)}
                className="border-tech-border text-tech-navy hover:bg-tech-content"
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
              className="flex items-center space-x-2 border-tech-border text-tech-navy hover:bg-tech-content"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </Button>
            
            <Button
              onClick={onFinalize}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white flex items-center space-x-2"
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
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white flex items-center space-x-2"
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
