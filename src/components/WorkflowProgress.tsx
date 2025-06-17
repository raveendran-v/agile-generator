
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Play } from 'lucide-react';

interface WorkflowProgressProps {
  totalEpics: number;
  completedEpics: number;
  availableEpics: number;
  totalStories?: number;
  storiesPerEpic?: { [epicId: string]: number };
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  totalEpics,
  completedEpics,
  availableEpics,
  totalStories = 0,
  storiesPerEpic = {}
}) => {
  const progressPercentage = totalEpics > 0 ? (completedEpics / totalEpics) * 100 : 0;
  
  const steps = [
    {
      label: 'Completed',
      count: completedEpics,
      subLabel: `${Object.values(storiesPerEpic).reduce((sum, count) => sum + count, 0)} stories`,
      color: 'text-green-700',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-300',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    {
      label: 'In Progress',
      count: availableEpics,
      subLabel: 'Ready for stories',
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-300',
      icon: Play,
      iconColor: 'text-orange-600'
    },
    {
      label: 'Pending',
      count: totalEpics - completedEpics - availableEpics,
      subLabel: 'Awaiting turn',
      color: 'text-purple-700',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
      icon: Circle,
      iconColor: 'text-purple-700'
    }
  ];

  if (totalEpics === 0) return null;

  return (
    <div className="space-y-6">
      {/* Modern Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-purple-800">
            Project Progress
          </h3>
          <div className="text-right">
            <span className="text-sm font-medium text-pink-600">
              {Math.round(progressPercentage)}%
            </span>
            {totalStories > 0 && (
              <div className="text-xs text-gray-600">
                {totalStories} stories total
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-gradient-to-r from-gray-200 to-gray-300"
          />
          
          {/* Animated gradient overlay for active progress */}
          <div 
            className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 transition-all duration-1000 ease-out opacity-90"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Step Cards */}
      <div className="grid grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.label}
              className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 hover:scale-105 hover:shadow-lg ${step.bgColor} ${step.borderColor}`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-12"></div>
              </div>
              
              <div className="relative z-10 flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white/80 border-2 ${step.borderColor} shadow-sm`}>
                  <Icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-2xl font-bold ${step.color} transition-all duration-300`}>
                    {step.count}
                  </div>
                  <div className="text-xs font-medium text-gray-800 truncate">
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {step.subLabel}
                  </div>
                </div>
              </div>

              {/* Animated border effect for active step */}
              {step.count > 0 && index === 1 && (
                <div className="absolute inset-0 border-2 border-orange-400 rounded-xl animate-pulse opacity-50"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-300">
          <div className="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium text-purple-800">
            {completedEpics === totalEpics 
              ? `🎉 All ${totalEpics} epics completed with ${totalStories} stories!` 
              : availableEpics > 0 
                ? `${availableEpics} epic${availableEpics === 1 ? '' : 's'} ready for story generation`
                : "Ready to begin story generation"
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;
