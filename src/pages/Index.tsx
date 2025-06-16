import React, { useState } from 'react';
import Header from '../components/Header';
import BRDInput from '../components/BRDInput';
import EpicGeneration from '../components/EpicGeneration';
import StoryGeneration from '../components/StoryGeneration';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { generateEpicsWithGroq, generateStoriesWithGroq } from '@/lib/groqService';

export interface Epic {
  id: string;
  epic_name: string;
  epic_description: string;
}

export interface Story {
  id: string;
  epicId: string;
  story_name: string;
  description: string;
  label: string;
  status: string;
  acceptance_criteria: string[];
  nfrs: string[];
  dod: string[];
  dor: string[];
}

const Index = () => {
  const [brdContent, setBrdContent] = useState('');
  const [epics, setEpics] = useState<Epic[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [currentIterationStories, setCurrentIterationStories] = useState<Story[]>([]);
  const [selectedEpicId, setSelectedEpicId] = useState<string>('');
  const [processedEpicIds, setProcessedEpicIds] = useState<Set<string>>(new Set());
  const [isEpicsFinalized, setIsEpicsFinalized] = useState(false);
  const [isCurrentIterationFinalized, setIsCurrentIterationFinalized] = useState(false);
  const [isGeneratingEpics, setIsGeneratingEpics] = useState(false);
  const [isGeneratingStories, setIsGeneratingStories] = useState(false);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<'brd' | 'epics' | 'stories' | 'iteration-complete'>('brd');
  const { toast } = useToast();

  const getAvailableEpics = () => {
    return epics.filter(epic => !processedEpicIds.has(epic.id));
  };

  const handleBRDSubmit = async (content: string) => {
    setBrdContent(content);
    setIsGeneratingEpics(true);
    setEpics([]);
    setSelectedEpicId('');
    setAllStories([]);
    setCurrentIterationStories([]);
    setProcessedEpicIds(new Set());
    setIsEpicsFinalized(false);
    setIsCurrentIterationFinalized(false);
    setCurrentWorkflowStep('brd');
    
    try {
      const generatedEpics = await generateEpicsWithGroq(content);
      setEpics(generatedEpics);
      setCurrentWorkflowStep('epics');
      toast({
        title: "Epics Generated Successfully",
        description: `Generated ${generatedEpics.length} epics using Groq AI.`
      });
    } catch (error) {
      console.error("BRD Submit Error:", error);
      toast({
        title: "Error Generating Epics",
        description: error instanceof Error ? error.message : "An unknown error occurred. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingEpics(false);
    }
  };

  const handleRegenerateEpics = async (feedback: string) => {
    if (!brdContent) {
      toast({ title: "Error", description: "BRD content is missing.", variant: "destructive"});
      return;
    }
    setIsGeneratingEpics(true);
    setSelectedEpicId('');
    setAllStories([]);
    setCurrentIterationStories([]);
    setProcessedEpicIds(new Set());
    setIsEpicsFinalized(false);
    setIsCurrentIterationFinalized(false);
    
    try {
      const generatedEpics = await generateEpicsWithGroq(brdContent);
      setEpics(generatedEpics);
      setCurrentWorkflowStep('epics');
      toast({
        title: "Epics Regenerated",
        description: "Epics have been regenerated using Groq AI."
      });
    } catch (error) {
      toast({
        title: "Error Regenerating Epics",
        description: error instanceof Error ? error.message : "Failed to regenerate epics. Check console.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingEpics(false);
    }
  };

  const handleFinalizeEpics = () => {
    setIsEpicsFinalized(true);
    toast({
      title: "Epics Finalized",
      description: `${epics.length} epics are now locked. Select an epic to generate user stories.`
    });
  };

  const handleSelectEpic = (epicId: string) => {
    setSelectedEpicId(epicId);
    setCurrentIterationStories([]);
    setIsCurrentIterationFinalized(false);
    setCurrentWorkflowStep('stories');
  };

  const handleGenerateStories = async () => {
    if (!selectedEpicId) {
      toast({ title: "No Epic Selected", description: "Please select an epic to generate stories for.", variant: "destructive"});
      return;
    }
    
    const selectedEpic = epics.find(epic => epic.id === selectedEpicId);
    if (!selectedEpic) return;
    
    setIsGeneratingStories(true);
    setCurrentIterationStories([]);
    
    try {
      const generatedStories = await generateStoriesWithGroq([selectedEpic], brdContent);
      setCurrentIterationStories(generatedStories);
      toast({
        title: "User Stories Generated",
        description: `Generated ${generatedStories.length} user stories for the selected epic using Groq AI.`
      });
    } catch (error) {
      console.error("Generate Stories Error:", error);
      toast({
        title: "Error Generating Stories",
        description: error instanceof Error ? error.message : "An unknown error occurred. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingStories(false);
    }
  };

  const handleRegenerateStories = async (feedback: string) => {
    if (!selectedEpicId) {
      toast({ title: "No Epic Selected", description: "Cannot regenerate stories without selected epic.", variant: "destructive"});
      return;
    }
    
    const selectedEpic = epics.find(epic => epic.id === selectedEpicId);
    if (!selectedEpic) return;
    
    setIsGeneratingStories(true);
    
    try {
      const generatedStories = await generateStoriesWithGroq([selectedEpic], brdContent);
      setCurrentIterationStories(generatedStories);
      toast({
        title: "Stories Regenerated",
        description: `User stories have been regenerated for the selected epic using Groq AI.`
      });
    } catch (error) {
      toast({
        title: "Error Regenerating Stories",
        description: error instanceof Error ? error.message : "Failed to regenerate stories. Check console.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingStories(false);
    }
  };

  const handleFinalizeCurrentIteration = () => {
    setAllStories(prev => [...prev, ...currentIterationStories]);
    const newProcessedEpicIds = new Set([...processedEpicIds, selectedEpicId]);
    setProcessedEpicIds(newProcessedEpicIds);
    setSelectedEpicId('');
    setCurrentIterationStories([]);
    setIsCurrentIterationFinalized(false);
    
    const remainingEpics = epics.filter(epic => !newProcessedEpicIds.has(epic.id));
    
    if (remainingEpics.length > 0) {
      setCurrentWorkflowStep('epics');
      toast({
        title: "Stories Finalized",
        description: `Stories finalized for this epic. ${remainingEpics.length} epic(s) remaining. Select another epic to continue.`
      });
    } else {
      setCurrentWorkflowStep('iteration-complete');
      toast({
        title: "All Stories Complete",
        description: "All epics now have user stories generated. Process complete!"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-content via-white to-blue-50">
      <Header />
      
      <main className="container mx-auto px-6 py-12 space-y-12">
        <BRDInput 
          onSubmit={handleBRDSubmit}
          workflowStep={currentWorkflowStep}
          isGeneratingEpics={isGeneratingEpics}
          isGeneratingStories={isGeneratingStories}
        />
        
        {epics.length > 0 && currentWorkflowStep === 'epics' && (
          <EpicGeneration
            epics={getAvailableEpics()}
            allEpics={epics}
            epicsWithStories={processedEpicIds}
            isFinalized={isEpicsFinalized}
            isGenerating={isGeneratingEpics}
            selectedEpicIds={selectedEpicId ? [selectedEpicId] : []}
            onEpicSelectionChange={(epicIds) => setSelectedEpicId(epicIds[0] || '')}
            onRegenerate={handleRegenerateEpics}
            onFinalize={handleFinalizeEpics}
            onSelectEpic={handleSelectEpic}
            onGenerateStoriesForEpic={handleSelectEpic}
            allStories={allStories}
          />
        )}
        
        {currentWorkflowStep === 'stories' && selectedEpicId && (
          <StoryGeneration
            stories={currentIterationStories}
            allStories={allStories}
            epics={epics.filter(epic => epic.id === selectedEpicId)}
            isFinalized={isCurrentIterationFinalized}
            isGenerating={isGeneratingStories}
            hasRemainingEpics={getAvailableEpics().length > 0}
            onGenerate={handleGenerateStories}
            onRegenerate={handleRegenerateStories}
            onFinalize={handleFinalizeCurrentIteration}
            onStartNewIteration={() => setCurrentWorkflowStep('epics')}
            onCompleteProcess={() => setCurrentWorkflowStep('iteration-complete')}
            autoGenerate={true}
          />
        )}
        
        {currentWorkflowStep === 'iteration-complete' && allStories.length > 0 && (
          <StoryGeneration
            stories={allStories}
            allStories={allStories}
            epics={epics}
            isFinalized={true}
            isGenerating={false}
            hasRemainingEpics={false}
            onGenerate={() => {}}
            onRegenerate={() => {}}
            onFinalize={() => {}}
            onStartNewIteration={() => {}}
            onCompleteProcess={() => {}}
            autoGenerate={false}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
