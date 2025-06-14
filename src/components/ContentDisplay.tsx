
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentDisplayProps {
  content: string;
  title: string;
  description: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  title,
  description
}) => {
  return (
    <Card className="h-fit shadow-modern border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-serif text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {description}
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
  );
};

export default ContentDisplay;
