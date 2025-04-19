import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Ensure progress is within 0-100 range
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">Progress</span>
        <span className="text-sm font-medium text-gray-300">{Math.round(clampedProgress)}%</span>
      </div>
      <div className="loader">
        <div 
          className="loader-bar"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      
      {/* Animated dots for progress indication */}
      {progress < 100 && (
        <div className="flex justify-center mt-3">
          <span className="inline-flex space-x-1">
            <span className="animate-ping delay-75 h-2 w-2 rounded-full bg-primary-500 opacity-75"></span>
            <span className="animate-ping delay-150 h-2 w-2 rounded-full bg-primary-500 opacity-75"></span>
            <span className="animate-ping delay-300 h-2 w-2 rounded-full bg-primary-500 opacity-75"></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;