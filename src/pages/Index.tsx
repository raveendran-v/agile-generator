
import React, { useState } from 'react';
import Header from '../components/Header';
import BRDInput from '../components/BRDInput';
import EpicGeneration from '../components/EpicGeneration';
import StoryGeneration from '../components/StoryGeneration';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleBRDSubmit = async (content: string) => {
    setBrdContent(content);
    setIsGeneratingEpics(true);
    
    try {
      // Simulate API call to generate epics
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockEpics: Epic[] = [
        {
          id: '1',
          epic_name: 'User Authentication and Authorization',
          epic_description: 'Implement secure user registration, login, and role-based access control to ensure only authorized users can access system features.'
        },
        {
          id: '2',
          epic_name: 'Document Management System',
          epic_description: 'Create a comprehensive document upload, storage, and retrieval system supporting multiple file formats with version control.'
        },
        {
          id: '3',
          epic_name: 'AI-Powered Content Generation',
          epic_description: 'Integrate LLM capabilities to automatically generate epics and user stories from business requirements documents.'
        },
        {
          id: '4',
          epic_name: 'Project Dashboard and Analytics',
          epic_description: 'Build an intuitive dashboard displaying project metrics, progress tracking, and comprehensive analytics for stakeholders.'
        },
        {
          id: '5',
          epic_name: 'Export and Reporting Features',
          epic_description: 'Develop export functionality for generating professional reports and documents in various formats including DOCX and PDF.'
        },
        {
          id: '6',
          epic_name: 'Collaboration and Feedback System',
          epic_description: 'Enable team collaboration through commenting, feedback collection, and iterative refinement of generated content.'
        },
        {
          id: '7',
          epic_name: 'System Administration and Configuration',
          epic_description: 'Provide administrative tools for system configuration, user management, and platform customization capabilities.'
        }
      ];
      
      setEpics(mockEpics);
      toast({
        title: "Epics Generated Successfully",
        description: `Generated ${mockEpics.length} epics from your BRD.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate epics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingEpics(false);
    }
  };

  const handleRegenerateEpics = async (feedback: string) => {
    setIsGeneratingEpics(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Epics Regenerated",
        description: "Your feedback has been incorporated into the updated epics."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate epics. Please try again.",
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
    setIsGeneratingStories(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const mockStories: Story[] = [
        {
          id: '1',
          epicId: '1',
          story_name: 'As a new user, I want to register an account so that I can access the platform features',
          description: 'Users need to create accounts with email verification to access the system securely.',
          label: 'Authentication',
          status: 'To Do',
          acceptance_criteria: [
            'User can register with email and password',
            'Email verification is required before account activation',
            'Password meets security requirements',
            'Registration form validates all required fields'
          ],
          nfrs: [
            'Registration process completes within 3 seconds',
            'Password encryption using industry standards',
            'GDPR compliant data collection',
            'Mobile responsive registration form'
          ],
          dod: [
            'Code reviewed and approved',
            'Unit tests written and passing',
            'Integration tests completed',
            'Security audit passed'
          ],
          dor: [
            'Acceptance criteria clearly defined',
            'UI mockups approved',
            'Dependencies identified'
          ]
        },
        {
          id: '2',
          epicId: '2',
          story_name: 'As a user, I want to upload documents in multiple formats so that I can process different types of BRDs',
          description: 'Enable users to upload PDF, DOCX, and TXT files with proper validation and processing.',
          label: 'Document Management',
          status: 'To Do',
          acceptance_criteria: [
            'Support for PDF, DOCX, and TXT file formats',
            'File size limit of 10MB enforced',
            'Upload progress indicator displayed',
            'Error handling for unsupported formats'
          ],
          nfrs: [
            'File upload completes within 10 seconds for 10MB files',
            'Virus scanning for uploaded files',
            'Secure file storage with encryption',
            'Cross-browser compatibility'
          ],
          dod: [
            'File validation logic implemented',
            'Error handling tested',
            'Performance benchmarks met',
            'Documentation updated'
          ],
          dor: [
            'File format specifications defined',
            'Storage requirements clarified'
          ]
        }
      ];
      
      setStories(mockStories);
      toast({
        title: "User Stories Generated",
        description: `Generated ${mockStories.length} user stories from your epics.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate user stories. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingStories(false);
    }
  };

  const handleRegenerateStories = async (feedback: string) => {
    setIsGeneratingStories(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Stories Regenerated",
        description: "Your feedback has been incorporated into the updated user stories."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate stories. Please try again.",
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <BRDInput onSubmit={handleBRDSubmit} />
        
        {epics.length > 0 && (
          <EpicGeneration
            epics={epics}
            isFinalized={isEpicsFinalized}
            isGenerating={isGeneratingEpics}
            onRegenerate={handleRegenerateEpics}
            onFinalize={handleFinalizeEpics}
          />
        )}
        
        {isEpicsFinalized && (
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
