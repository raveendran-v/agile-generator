import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BRDInput from '../components/BRDInput';
import EpicGeneration from '../components/EpicGeneration';
import StoryGeneration from '../components/StoryGeneration';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateEpicsWithGroq, generateStoriesWithGroq } from '@/lib/groqService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
  const [stories, setStories] = useState<Story[]>([]);
  const [isEpicsFinalized, setIsEpicsFinalized] = useState(false);
  const [isStoriesFinalized, setIsStoriesFinalized] = useState(false);
  const [isGeneratingEpics, setIsGeneratingEpics] = useState(false);
  const [isGeneratingStories, setIsGeneratingStories] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedApiKey = localStorage.getItem('groqApiKey');
    if (storedApiKey) {
      setGroqApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroqApiKey(e.target.value);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('groqApiKey', groqApiKey);
    toast({
      title: 'API Key Saved',
      description: 'Your Groq API key has been saved locally for this session.',
    });
  };

  // Get current workflow step
  const getCurrentWorkflowStep = () => {
    if (isStoriesFinalized) return 'stories';
    if (isEpicsFinalized || stories.length > 0) return 'stories';
    if (epics.length > 0) return 'epics';
    return 'brd';
  };

  const handleBRDSubmit = async (content: string) => {
    if (!groqApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Groq API key to generate epics.",
        variant: "destructive",
      });
      return;
    }
    setBrdContent(content);
    setIsGeneratingEpics(true);
    setEpics([]); // Clear previous epics
    
    try {
      const generatedEpics = await generateEpicsWithGroq(content, { apiKey: groqApiKey });
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
    if (!groqApiKey) {
      toast({ title: "API Key Required", description: "Groq API key needed.", variant: "destructive"});
      return;
    }
    setIsGeneratingEpics(true);
    try {
      const generatedEpics = await generateEpicsWithGroq(brdContent, { apiKey: groqApiKey });
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
    if (!groqApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Groq API key to generate stories.",
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
      const generatedStories = await generateStoriesWithGroq(epics, brdContent, { apiKey: groqApiKey });
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
     if (!groqApiKey) {
      toast({ title: "API Key Required", description: "Groq API key needed.", variant: "destructive"});
      return;
    }
    if (epics.length === 0) {
        toast({ title: "No Epics", description: "Cannot regenerate stories without epics.", variant: "destructive"});
        return;
    }
    setIsGeneratingStories(true);
    try {
      const generatedStories = await generateStoriesWithGroq(epics, brdContent, { apiKey: groqApiKey });
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
        <div className="mb-8 p-6 bg-stone-100 dark:bg-stone-800 rounded-lg shadow">
          <Label htmlFor="groqApiKey" className="text-lg font-semibold text-stone-700 dark:text-stone-300">Groq API Key</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              id="groqApiKey"
              type="password"
              placeholder="Enter your Groq API key"
              value={groqApiKey}
              onChange={handleApiKeyChange}
              className="flex-grow"
            />
            <Button onClick={handleSaveApiKey} variant="secondary">Save Key</Button>
          </div>
          <Alert variant="default" className="mt-4 bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-700 dark:text-amber-300">API Key Security</AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-400">
              Your API key is stored in your browser's local storage for convenience during this session. For production applications, never expose API keys on the client-side. Use a secure backend proxy or serverless functions.
            </AlertDescription>
          </Alert>
        </div>

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
        
        {isEpicsFinalized && epics.length > 0 && ( // Added epics.length > 0 check
          <StoryGeneration
            stories={stories}
            epics={epics} // Pass epics to StoryGeneration
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
