
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Play } from 'lucide-react';

interface WorkflowProgressProps {
  totalEpics: number;
  completedEpics: number;
  availableEpics: number;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  totalEpics,
  completedEpics,
  availableEpics
}) => {
  const progressPercentage = totalEpics > 0 ? (completedEpics / totalEpics) * 100 : 0;
  
  const steps = [
    {
      label: 'Completed',
      count: completedEpics,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-300 dark:border-green-700',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    {
      label: 'In Progress',
      count: availableEpics,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      borderColor: 'border-orange-300 dark:border-orange-700',
      icon: Play,
      iconColor: 'text-orange-600'
    },
    {
      label: 'Pending',
      count: totalEpics - completedEpics - availableEpics,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      borderColor: 'border-gray-300 dark:border-gray-600',
      icon: Circle,
      iconColor: 'text-gray-500'
    }
  ];

  if (totalEpics === 0) return null;

  return (
    <div className="space-y-6">
      {/* Modern Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Project Progress
          </h3>
          <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
          />
          
          {/* Animated gradient overlay for active progress */}
          <div 
            className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transition-all duration-1000 ease-out opacity-90"
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
                <div className={`p-2 rounded-lg ${step.bgColor} border ${step.borderColor}`}>
                  <Icon className={`w-4 h-4 ${step.iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-2xl font-bold ${step.color} transition-all duration-300`}>
                    {step.count}
                  </div>
                  <div className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate">
                    {step.label}
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
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {completedEpics === totalEpics 
              ? "🎉 All epics completed!" 
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
