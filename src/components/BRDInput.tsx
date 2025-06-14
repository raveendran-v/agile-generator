
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import FileUpload from './FileUpload';
import WorkflowProgressCard from './WorkflowProgressCard';
import ContentDisplay from './ContentDisplay';

interface BRDInputProps {
  onSubmit: (content: string) => void;
  workflowStep?: 'brd' | 'epics' | 'stories' | 'iteration-complete';
  isGeneratingEpics?: boolean;
  isGeneratingStories?: boolean;
}

const BRDInput: React.FC<BRDInputProps> = ({ 
  onSubmit, 
  workflowStep = 'brd',
  isGeneratingEpics = false,
  isGeneratingStories = false 
}) => {
  const { toast } = useToast();
  const {
    uploadedFile,
    isUploading,
    uploadProgress,
    content,
    handleFileSelect
  } = useFileUpload();

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please upload a BRD file to generate epics and user stories.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(content);
  };

  return (
    <div className="w-full space-y-8">
      <WorkflowProgressCard
        workflowStep={workflowStep}
        uploadedFile={uploadedFile}
        isGeneratingEpics={isGeneratingEpics}
        isGeneratingStories={isGeneratingStories}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - File Upload */}
        <div className="order-1 lg:order-1">
          <Card className="h-fit shadow-modern border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-serif text-gray-900 dark:text-gray-100">
                Business Requirements Document
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Upload your BRD file to generate epics and user stories automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                onFileSelect={handleFileSelect}
                uploadedFile={uploadedFile}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                disabled={isUploading}
              />

              {uploadedFile && content && (
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isUploading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-white font-semibold rounded-xl border-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)'
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Epics
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right side - BRD Content Display */}
        {content && (
          <div className="order-2 lg:order-2">
            <ContentDisplay
              content={content}
              title="BRD Content"
              description="Extracted content from your uploaded document"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BRDInput;
