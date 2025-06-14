
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { Epic } from '@/pages/Index';

interface EpicCardProps {
  epic: Epic;
  index: number;
  isFinalized: boolean;
  onGenerateStory: (epicId: string) => void;
}

const EpicCard: React.FC<EpicCardProps> = ({
  epic,
  index,
  isFinalized,
  onGenerateStory
}) => {
  return (
    <div className="p-4 border rounded-lg transition-all border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {index + 1}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
              {epic.epic_name}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Pending
              </Badge>
              {isFinalized && (
                <Button 
                  size="sm" 
                  className="bg-amber-800 hover:bg-amber-700"
                  onClick={() => onGenerateStory(epic.id)}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Generate Story
                </Button>
              )}
            </div>
          </div>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            {epic.epic_description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EpicCard;
