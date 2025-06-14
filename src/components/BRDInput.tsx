import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BRDInputProps {
  onSubmit: (content: string) => void;
  workflowStep?: 'brd' | 'epics' | 'stories';
  isGeneratingEpics?: boolean;
  isGeneratingStories?: boolean;
}

const BRDInput: React.FC<BRDInputProps> = ({ 
  onSubmit, 
  workflowStep = 'brd',
  isGeneratingEpics = false,
  isGeneratingStories = false 
}) => {
  const [content, setContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Calculate workflow progress
  const getWorkflowProgress = () => {
    if (workflowStep === 'brd' && !uploadedFile) return 0;
    if (workflowStep === 'brd' && uploadedFile) return 33;
    if (workflowStep === 'epics' || isGeneratingEpics) return 66;
    if (workflowStep === 'stories' || isGeneratingStories) return 100;
    return 0;
  };

  const getWorkflowStepText = () => {
    if (isGeneratingStories) return 'Generating Stories...';
    if (isGeneratingEpics) return 'Generating Epics...';
    if (workflowStep === 'stories') return 'Stories Complete';
    if (workflowStep === 'epics') return 'Epics Complete';
    if (uploadedFile) return 'BRD Uploaded';
    return 'Upload BRD';
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          // For text files, return content directly
          if (file.type === 'text/plain') {
            resolve(result);
            return;
          }
          
          // For other files, try to extract text content
          // This is a simplified extraction - in a real app, you'd use proper parsers
          try {
            // Remove any binary characters and extract readable text
            const cleanText = result
              .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
              .replace(/[^\x20-\x7E\s]/g, '') // Keep only printable ASCII and whitespace
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();
            
            if (cleanText.length > 50) {
              resolve(cleanText);
            } else {
              // Fallback for files that don't extract well
              resolve(`Content extracted from ${file.name}\n\nFile contains: ${file.size} bytes of data\nFile type: ${file.type}\n\nNote: This is a simplified text extraction. For full document parsing, a specialized library would be needed.`);
            }
          } catch (error) {
            reject(new Error('Failed to extract text from file'));
          }
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);
    setUploadProgress(0);

    try {
      // Show upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);

      // Extract actual content from the file
      const extractedContent = await extractTextFromFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setContent(extractedContent);
      
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} has been processed and content extracted.`
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
      setUploadProgress(0);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

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

  const workflowProgress = getWorkflowProgress();

  return (
    <div className="w-full space-y-8">
      {/* Modern Workflow Progress Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 p-8 shadow-modern border border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-primary">
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
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                workflowProgress >= 33 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {workflowProgress >= 33 && <CheckCircle className="w-3 h-3" />}
                <span>BRD Upload</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                workflowProgress >= 66 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {workflowProgress >= 66 && <CheckCircle className="w-3 h-3" />}
                <span>Epics</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                workflowProgress >= 100 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {workflowProgress >= 100 && <CheckCircle className="w-3 h-3" />}
                <span>Stories</span>
              </div>
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

      {/* File Upload Progress (only shown during upload) */}
      {isUploading && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Processing document...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

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
              {/* Modern File Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                      isUploading 
                        ? 'border-secondary/50 bg-secondary/5' 
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      {isUploading ? (
                        <div className="space-y-3 text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mx-auto"></div>
                          <p className="text-sm text-secondary font-medium">Processing your document...</p>
                        </div>
                      ) : (
                        <div className="space-y-3 text-center">
                          <div className="p-3 rounded-full bg-gradient-primary mx-auto w-fit">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              PDF, DOCX, or TXT files (Max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {uploadedFile && (
                  <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Uploaded successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Epics Button - appears after upload */}
              {uploadedFile && content && (
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isUploading}
                  className="w-full h-12 bg-gradient-primary hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-white font-semibold rounded-xl"
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
            <Card className="h-fit shadow-modern border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-serif text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>BRD Content</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Extracted content from your uploaded document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-h-96 overflow-y-auto border border-gray-100 dark:border-gray-700 shadow-inner">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BRDInput;
