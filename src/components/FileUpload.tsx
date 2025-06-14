
import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploadedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  uploadedFile,
  isUploading,
  uploadProgress,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isUploading 
              ? 'border-secondary/50 bg-secondary/5' 
              : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center py-8">
            {isUploading ? (
              <div className="space-y-3 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mx-auto"></div>
                <p className="text-sm text-secondary font-medium">Processing your document...</p>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary mx-auto w-fit">
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
            name="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            aria-describedby="file-upload-description"
          />
        </label>
      </div>

      <div id="file-upload-description" className="sr-only">
        Upload a business requirements document in PDF, DOCX, or TXT format, maximum size 10MB
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Processing document...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress 
            value={uploadProgress} 
            className="h-2" 
            aria-label={`Upload progress: ${uploadProgress}%`}
          />
        </div>
      )}

      {/* Uploaded File Display */}
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
  );
};

export default FileUpload;
