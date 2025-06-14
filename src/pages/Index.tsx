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

const USER_PROVIDED_GROQ_API_KEY = "YOUR_GROQ_API_KEY_NEEDS_TO_BE_SET";

const Index = () => {
  const [brdContent, setBrdContent] = useState('');
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isEpicsFinalized, setIsEpicsFinalized] = useState(false);
  const [isStoriesFinalized, setIsStoriesFinalized] = useState(false);
  const [isGeneratingEpics, setIsGeneratingEpics] = useState(false);
  const [isGeneratingStories, setIsGeneratingStories] = useState(false);
  const { toast } = useToast();

  // Get current workflow step
  const getCurrentWorkflowStep = () => {
    if (isStoriesFinalized) return 'stories';
    if (isEpicsFinalized || stories.length > 0) return 'stories';
    if (epics.length > 0) return 'epics';
    return 'brd';
  };

  const handleBRDSubmit = async (content: string) => {
    if (!USER_PROVIDED_GROQ_API_KEY || USER_PROVIDED_GROQ_API_KEY === "YOUR_GROQ_API_KEY_NEEDS_TO_BE_SET") {
      toast({
        title: "API Key Not Set",
        description: "The Groq API key needs to be configured. Please provide it in the chat.",
        variant: "destructive",
      });
      return;
    }
    setBrdContent(content);
    setIsGeneratingEpics(true);
    setEpics([]); // Clear previous epics
    
    try {
      const generatedEpics = await generateEpicsWithGroq(content, { apiKey: USER_PROVIDED_GROQ_API_KEY });
      setEpics(generatedEpics);
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
    // Simple regeneration for now, feedback string is not used yet.
    if (!brdContent) {
        toast({ title: "Error", description: "BRD content is missing.", variant: "destructive"});
        return;
    }
    if (!USER_PROVIDED_GROQ_API_KEY || USER_PROVIDED_GROQ_API_KEY === "YOUR_GROQ_API_KEY_NEEDS_TO_BE_SET") {
      toast({ title: "API Key Not Set", description: "Groq API key needed. Please provide it in the chat.", variant: "destructive"});
      return;
    }
    setIsGeneratingEpics(true);
    try {
      const generatedEpics = await generateEpicsWithGroq(brdContent, { apiKey: USER_PROVIDED_GROQ_API_KEY });
      setEpics(generatedEpics);
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
      description: "Your epics are now locked. You can proceed to generate user stories."
    });
  };

  const handleGenerateStories = async () => {
    if (!USER_PROVIDED_GROQ_API_KEY || USER_PROVIDED_GROQ_API_KEY === "YOUR_GROQ_API_KEY_NEEDS_TO_BE_SET") {
      toast({
        title: "API Key Not Set",
        description: "The Groq API key needs to be configured. Please provide it in the chat.",
        variant: "destructive",
      });
      return;
    }
    if (epics.length === 0) {
        toast({ title: "No Epics", description: "Cannot generate stories without epics.", variant: "destructive"});
        return;
    }
    setIsGeneratingStories(true);
    setStories([]); // Clear previous stories
    
    try {
      const generatedStories = await generateStoriesWithGroq(epics, brdContent, { apiKey: USER_PROVIDED_GROQ_API_KEY });
      setStories(generatedStories);
      toast({
        title: "User Stories Generated",
        description: `Generated ${generatedStories.length} user stories using Groq AI.`
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
    // Simple regeneration for now, feedback string is not used yet.
     if (!USER_PROVIDED_GROQ_API_KEY || USER_PROVIDED_GROQ_API_KEY === "YOUR_GROQ_API_KEY_NEEDS_TO_BE_SET") {
      toast({ title: "API Key Not Set", description: "Groq API key needed. Please provide it in the chat.", variant: "destructive"});
      return;
    }
    if (epics.length === 0) {
        toast({ title: "No Epics", description: "Cannot regenerate stories without epics.", variant: "destructive"});
        return;
    }
    setIsGeneratingStories(true);
    try {
      const generatedStories = await generateStoriesWithGroq(epics, brdContent, { apiKey: USER_PROVIDED_GROQ_API_KEY });
      setStories(generatedStories);
      toast({
        title: "Stories Regenerated",
        description: "User stories have been regenerated using Groq AI."
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

  const handleFinalizeStories = () => {
    setIsStoriesFinalized(true);
    toast({
      title: "Stories Finalized",
      description: "All user stories are now locked and ready for export."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-6 py-12 space-y-12">
        <BRDInput 
          onSubmit={handleBRDSubmit}
          workflowStep={getCurrentWorkflowStep()}
          isGeneratingEpics={isGeneratingEpics}
          isGeneratingStories={isGeneratingStories}
        />
        
        {epics.length > 0 && (
          <EpicGeneration
            epics={epics}
            isFinalized={isEpicsFinalized}
            isGenerating={isGeneratingEpics}
            onRegenerate={handleRegenerateEpics}
            onFinalize={handleFinalizeEpics}
          />
        )}
        
        {isEpicsFinalized && epics.length > 0 && (
          <StoryGeneration
            stories={stories}
            epics={epics}
            isFinalized={isStoriesFinalized}
            isGenerating={isGeneratingStories}
            onGenerate={handleGenerateStories}
            onRegenerate={handleRegenerateStories}
            onFinalize={handleFinalizeStories}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
