
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (file: File): FileValidationResult => {
  const allowedTypes = ['.pdf', '.docx', '.txt'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: "Invalid file type. Please upload a PDF, DOCX, or TXT file."
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File too large. Please upload a file smaller than 10MB."
    };
  }
  
  return { isValid: true };
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        if (file.type === 'text/plain') {
          resolve(result);
          return;
        }
        
        try {
          const cleanText = result
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
            .replace(/[^\x20-\x7E\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanText.length > 50) {
            resolve(cleanText);
          } else {
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
