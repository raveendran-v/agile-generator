
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateFile, extractTextFromFile } from '@/utils/fileValidation';

export const useFileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      toast({
        title: "Upload Failed",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);

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
      setContent('');
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setUploadedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setContent('');
  };

  return {
    uploadedFile,
    isUploading,
    uploadProgress,
    content,
    handleFileSelect,
    reset
  };
};
