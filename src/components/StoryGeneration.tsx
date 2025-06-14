import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, MessageSquare, RefreshCw, CheckCircle, Play, RotateCcw, ArrowRight } from 'lucide-react';
import { Story, Epic } from '../pages/Index';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface StoryGenerationProps {
  stories: Story[];
  allStories: Story[];
  epics: Epic[];
  isFinalized: boolean;
  isGenerating: boolean;
  hasRemainingEpics: boolean;
  onGenerate: () => void;
  onRegenerate: (feedback: string) => void;
  onFinalize: () => void;
  onStartNewIteration: () => void;
  onCompleteProcess: () => void;
  autoGenerate?: boolean;
}

const StoryGeneration: React.FC<StoryGenerationProps> = ({
  stories,
  allStories,
  epics,
  isFinalized,
  isGenerating,
  hasRemainingEpics,
  onGenerate,
  onRegenerate,
  onFinalize,
  onStartNewIteration,
  onCompleteProcess,
  autoGenerate = false
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleRegenerate = () => {
    if (!feedback.trim()) return;
    onRegenerate(feedback);
    setFeedback('');
    setShowFeedback(false);
  };

  const handleExport = async () => {
    const exportData = allStories.length > 0 ? allStories : stories;
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "User Stories",
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            text: `Generated on: ${new Date().toLocaleDateString()}`,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Total Stories: ${exportData.length}`,
            spacing: { after: 400 },
          }),
          ...exportData.flatMap((story, index) => [
            new Paragraph({
              text: `Story ${index + 1}: ${story.story_name}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Epic: ", bold: true }),
                new TextRun({ text: getEpicName(story.epicId) }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Description: ", bold: true }),
                new TextRun({ text: story.description }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Label: ", bold: true }),
                new TextRun({ text: story.label }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Status: ", bold: true }),
                new TextRun({ text: story.status }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: "Acceptance Criteria:",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            ...story.acceptance_criteria.map(criteria => 
              new Paragraph({
                text: `• ${criteria}`,
                spacing: { after: 100 },
              })
            ),
            new Paragraph({
              text: "Non-Functional Requirements:",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            ...story.nfrs.map(nfr => 
              new Paragraph({
                text: `• ${nfr}`,
                spacing: { after: 100 },
              })
            ),
            new Paragraph({
              text: "Definition of Done:",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            ...story.dod.map(item => 
              new Paragraph({
                text: `• ${item}`,
                spacing: { after: 100 },
              })
            ),
            new Paragraph({
              text: "Definition of Ready:",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            ...story.dor.map(item => 
              new Paragraph({
                text: `• ${item}`,
                spacing: { after: 100 },
              })
            ),
          ])
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = 'user-stories.docx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getEpicName = (epicId: string) => {
    return epics.find(epic => epic.id === epicId)?.epic_name || 'Unknown Epic';
  };

  const displayStories = allStories.length > 0 ? allStories : stories;
  const isShowingAllStories = allStories.length > 0 && stories.length === 0;

  // Only show the generate button if autoGenerate is false and there are no stories
  if (stories.length === 0 && !isShowingAllStories && !autoGenerate) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-stone-900 dark:text-stone-100">
            User Story Generation
          </CardTitle>
          <CardDescription>
            Generate detailed user stories from your selected epics.
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

  // Show loading state when auto-generating and no stories yet
  if (stories.length === 0 && !isShowingAllStories && autoGenerate && isGenerating) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-stone-900 dark:text-stone-100">
            User Story Generation
          </CardTitle>
          <CardDescription>
            Generating detailed user stories from your selected epic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-2 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800"></div>
            <span className="text-stone-600 dark:text-stone-400">
              Generating user stories from your epic...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl font-serif text-stone-900 dark:text-stone-100">
          <span>
            {isShowingAllStories ? 'All Generated User Stories' : 'Current Iteration - User Stories'}
          </span>
          {isFinalized && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
        <CardDescription>
          {isShowingAllStories 
            ? `Complete collection of ${displayStories.length} user stories from all iterations.`
            : isFinalized 
              ? "Current iteration stories are finalized."
              : `Review and refine your generated user stories for ${epics.length} selected epic(s).`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Iteration Summary */}
        {!isShowingAllStories && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
              Current Iteration: {stories.length} stories for {epics.length} epic(s)
            </div>
            {allStories.length > 0 && (
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Total stories across all iterations: {allStories.length + stories.length}
              </div>
            )}
          </div>
        )}

        {/* Story List */}
        <div className="space-y-6">
          {displayStories.map((story, index) => (
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
        {showFeedback && !isFinalized && !isShowingAllStories && (
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

        {/* Current Iteration Action Buttons */}
        {!isFinalized && !isShowingAllStories && (
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
              <span>Finalize Current Iteration</span>
            </Button>
          </div>
        )}

        {/* Iteration Complete Action Buttons */}
        {isFinalized && !isShowingAllStories && (
          <div className="flex flex-wrap gap-3">
            {hasRemainingEpics ? (
              <>
                <Button
                  onClick={onStartNewIteration}
                  className="bg-amber-800 hover:bg-amber-700 flex items-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Continue with Remaining Epics</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onCompleteProcess}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Process</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={onCompleteProcess}
                className="bg-green-700 hover:bg-green-600 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Process</span>
              </Button>
            )}
          </div>
        )}

        {/* Export Button */}
        {(isFinalized || isShowingAllStories) && (
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-500 flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Stories as DOCX</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StoryGeneration;
