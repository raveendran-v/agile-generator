
import React, { useState, useEffect } from 'react';
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
  const [selectedEpicIds, setSelectedEpicIds] = useState<string[]>([]);
  const [epicsWithStories, setEpicsWithStories] = useState<Set<string>>(new Set());
  const [isEpicsFinalized, setIsEpicsFinalized] = useState(false);
  const [isCurrentIterationFinalized, setIsCurrentIterationFinalized] = useState(false);
  const [isGeneratingEpics, setIsGeneratingEpics] = useState(false);
  const [isGeneratingStories, setIsGeneratingStories] = useState(false);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<'brd' | 'epics' | 'stories' | 'iteration-complete'>('brd');
  const [showExportAndEnd, setShowExportAndEnd] = useState(false);
  const { toast } = useToast();

  // Auto-select all available epics when they are generated or when starting a new iteration
  useEffect(() => {
    if (epics.length > 0 && selectedEpicIds.length === 0 && currentWorkflowStep === 'epics') {
      const availableEpics = epics.filter(epic => !epicsWithStories.has(epic.id));
      setSelectedEpicIds(availableEpics.map(epic => epic.id));
    }
  }, [epics, epicsWithStories, currentWorkflowStep]);

  // Get available epics (those without stories yet)
  const getAvailableEpics = () => {
    return epics.filter(epic => !epicsWithStories.has(epic.id));
  };

  const handleBRDSubmit = async (content: string) => {
    setBrdContent(content);
    setIsGeneratingEpics(true);
    // Reset all state for new BRD
    setEpics([]);
    setSelectedEpicIds([]);
    setAllStories([]);
    setCurrentIterationStories([]);
    setEpicsWithStories(new Set());
    setIsEpicsFinalized(false);
    setIsCurrentIterationFinalized(false);
    setShowExportAndEnd(false);
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
    // Reset epic-related state
    setSelectedEpicIds([]);
    setAllStories([]);
    setCurrentIterationStories([]);
    setEpicsWithStories(new Set());
    setIsEpicsFinalized(false);
    setIsCurrentIterationFinalized(false);
    setShowExportAndEnd(false);
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
    if (selectedEpicIds.length === 0) {
      toast({
        title: "No Epics Selected",
        description: "Please select at least one epic before finalizing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsEpicsFinalized(true);
    setCurrentWorkflowStep('stories');
    toast({
      title: "Epics Finalized",
      description: `${selectedEpicIds.length} epics are now locked. You can proceed to generate user stories.`
    });
  };

  const handleGenerateStories = async () => {
    if (selectedEpicIds.length === 0) {
        toast({ title: "No Epics Selected", description: "Please select epics to generate stories for.", variant: "destructive"});
        return;
    }
    
    const selectedEpics = epics.filter(epic => selectedEpicIds.includes(epic.id));
    setIsGeneratingStories(true);
    setCurrentIterationStories([]);
    
    try {
      const generatedStories = await generateStoriesWithGroq(selectedEpics, brdContent);
      setCurrentIterationStories(generatedStories);
      toast({
        title: "User Stories Generated",
        description: `Generated ${generatedStories.length} user stories for ${selectedEpics.length} selected epics using Groq AI.`
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
    if (selectedEpicIds.length === 0) {
        toast({ title: "No Epics Selected", description: "Cannot regenerate stories without selected epics.", variant: "destructive"});
        return;
    }
    
    const selectedEpics = epics.filter(epic => selectedEpicIds.includes(epic.id));
    setIsGeneratingStories(true);
    try {
      const generatedStories = await generateStoriesWithGroq(selectedEpics, brdContent);
      setCurrentIterationStories(generatedStories);
      toast({
        title: "Stories Regenerated",
        description: `User stories have been regenerated for ${selectedEpics.length} selected epics using Groq AI.`
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
    // Add current iteration stories to all stories
    setAllStories(prev => [...prev, ...currentIterationStories]);
    
    // Mark these epics as having stories
    const newEpicsWithStories = new Set([...epicsWithStories, ...selectedEpicIds]);
    setEpicsWithStories(newEpicsWithStories);
    
    // Show export and end flow buttons
    setShowExportAndEnd(true);
    setIsCurrentIterationFinalized(true);
    
    toast({
      title: "Stories Finalized",
      description: "Current iteration stories have been finalized. You can export or continue with remaining epics."
    });
  };

  const handleExportStories = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(allStories, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'user-stories.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Stories Exported",
      description: "User stories have been exported successfully."
    });
    
    // After export, check if there are remaining epics and reset for next iteration
    const remainingEpics = epics.filter(epic => !epicsWithStories.has(epic.id));
    
    if (remainingEpics.length > 0) {
      // Reset for next iteration
      setSelectedEpicIds([]);
      setCurrentIterationStories([]);
      setIsEpicsFinalized(false);
      setIsCurrentIterationFinalized(false);
      setShowExportAndEnd(false);
      setCurrentWorkflowStep('epics');
      
      toast({
        title: "Ready for Next Iteration",
        description: `${remainingEpics.length} epic(s) remaining. Select epics for the next iteration.`
      });
    } else {
      setCurrentWorkflowStep('iteration-complete');
      toast({
        title: "All Epics Complete",
        description: "All epics now have user stories generated!"
      });
    }
  };

  const handleEndFlow = () => {
    setCurrentWorkflowStep('iteration-complete');
    toast({
      title: "Flow Ended",
      description: "Story generation flow has been completed."
    });
  };

  const handleStartNewIteration = () => {
    setCurrentWorkflowStep('epics');
    setIsEpicsFinalized(false);
    toast({
      title: "Starting New Iteration",
      description: "Select remaining epics to generate more stories."
    });
  };

  const handleCompleteProcess = () => {
    setCurrentWorkflowStep('iteration-complete');
    toast({
      title: "Process Complete",
      description: "All user stories have been generated and finalized."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-6 py-12 space-y-12">
        <BRDInput 
          onSubmit={handleBRDSubmit}
          workflowStep={currentWorkflowStep}
          isGeneratingEpics={isGeneratingEpics}
          isGeneratingStories={isGeneratingStories}
        />
        
        {epics.length > 0 && (currentWorkflowStep === 'epics' || currentWorkflowStep === 'stories') && (
          <EpicGeneration
            epics={getAvailableEpics()}
            allEpics={epics}
            epicsWithStories={epicsWithStories}
            isFinalized={isEpicsFinalized}
            isGenerating={isGeneratingEpics}
            selectedEpicIds={selectedEpicIds}
            onEpicSelectionChange={setSelectedEpicIds}
            onRegenerate={handleRegenerateEpics}
            onFinalize={handleFinalizeEpics}
          />
        )}
        
        {currentWorkflowStep === 'stories' && selectedEpicIds.length > 0 && (
          <StoryGeneration
            stories={currentIterationStories}
            allStories={allStories}
            epics={epics.filter(epic => selectedEpicIds.includes(epic.id))}
            isFinalized={isCurrentIterationFinalized}
            isGenerating={isGeneratingStories}
            hasRemainingEpics={getAvailableEpics().length > selectedEpicIds.length}
            showExportAndEnd={showExportAndEnd}
            onGenerate={handleGenerateStories}
            onRegenerate={handleRegenerateStories}
            onFinalize={handleFinalizeCurrentIteration}
            onExport={handleExportStories}
            onEndFlow={handleEndFlow}
            onStartNewIteration={handleStartNewIteration}
            onCompleteProcess={handleCompleteProcess}
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
            showExportAndEnd={false}
            onGenerate={() => {}}
            onRegenerate={() => {}}
            onFinalize={() => {}}
            onExport={() => {}}
            onEndFlow={() => {}}
            onStartNewIteration={() => {}}
            onCompleteProcess={() => {}}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
