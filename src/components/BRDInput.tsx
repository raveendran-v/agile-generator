
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BRDInputProps {
  onSubmit: (content: string) => void;
}

const BRDInput: React.FC<BRDInputProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock file content extraction
      const mockContent = `Business Requirements Document

Project Overview:
This project aims to develop a comprehensive web application for managing business processes and workflows.

Key Requirements:
1. User Authentication System
2. Document Management Capabilities  
3. Automated Workflow Processing
4. Reporting and Analytics Dashboard
5. Integration with External APIs
6. Mobile-Responsive Design
7. Data Security and Compliance

Success Criteria:
- Improved operational efficiency by 40%
- Reduced processing time by 60%
- Enhanced user satisfaction scores
- Full compliance with industry standards`;

      setContent(mockContent);
      
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide BRD content either by uploading a file or entering text manually.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(content);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-stone-900 dark:text-stone-100">
          Business Requirements Document Input
        </CardTitle>
        <CardDescription>
          Upload your BRD file or paste the content directly to generate epics and user stories.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:border-stone-600 dark:hover:border-stone-500 dark:hover:bg-stone-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-stone-500 dark:text-stone-400" />
                    <p className="mb-2 text-sm text-stone-500 dark:text-stone-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      PDF, DOCX, or TXT (Max 10MB)
                    </p>
                  </>
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
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                {uploadedFile.name} uploaded successfully
              </span>
            </div>
          )}
        </div>

        {/* Manual Input Section */}
        <div className="space-y-2">
          <label htmlFor="brd-content" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Or enter BRD content manually:
          </label>
          <Textarea
            id="brd-content"
            placeholder="Paste your Business Requirements Document content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="min-h-[200px] resize-y"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isUploading}
          className="w-full bg-amber-800 hover:bg-amber-700 text-white font-medium"
        >
          Generate Epics
        </Button>
      </CardContent>
    </Card>
  );
};

export default BRDInput;
