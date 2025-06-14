
import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WorkflowProgressCardProps {
  workflowStep: 'brd' | 'epics' | 'stories' | 'iteration-complete';
  uploadedFile: File | null;
  isGeneratingEpics: boolean;
  isGeneratingStories: boolean;
}

const WorkflowProgressCard: React.FC<WorkflowProgressCardProps> = ({
  workflowStep,
  uploadedFile,
  isGeneratingEpics,
  isGeneratingStories
}) => {
  const getWorkflowProgress = () => {
    if (workflowStep === 'brd' && !uploadedFile) return 0;
    if (workflowStep === 'brd' && uploadedFile) return 33;
    if (workflowStep === 'epics' || isGeneratingEpics) return 66;
    if (workflowStep === 'stories' || workflowStep === 'iteration-complete' || isGeneratingStories) return 100;
    return 0;
  };

  const getWorkflowStepText = () => {
    if (isGeneratingStories) return 'Generating Stories...';
    if (isGeneratingEpics) return 'Generating Epics...';
    if (workflowStep === 'iteration-complete') return 'Flow Complete';
    if (workflowStep === 'stories') return 'Stories Complete';
    if (workflowStep === 'epics') return 'Epics Complete';
    if (uploadedFile) return 'BRD Uploaded';
    return 'Upload BRD';
  };

  const workflowProgress = getWorkflowProgress();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 p-8 shadow-modern border border-gray-100 dark:border-gray-800">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="relative space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-serif">
                Workflow Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transform your requirements into actionable stories
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Progress value={workflowProgress} className="h-2" />
          
          <div className="flex justify-between items-center">
            <WorkflowStep
              label="BRD Upload"
              completed={workflowProgress >= 33}
            />
            <WorkflowStep
              label="Epics"
              completed={workflowProgress >= 66}
            />
            <WorkflowStep
              label="Stories"
              completed={workflowProgress >= 100}
            />
          </div>
          
          <div className="text-center">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              isGeneratingEpics || isGeneratingStories 
                ? 'bg-secondary/10 text-secondary animate-pulse' 
                : 'bg-primary/10 text-primary'
            }`}>
              {getWorkflowStepText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WorkflowStepProps {
  label: string;
  completed: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ label, completed }) => (
  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
    completed 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  }`}>
    {completed && <CheckCircle className="w-3 h-3" />}
    <span>{label}</span>
  </div>
);

export default WorkflowProgressCard;
