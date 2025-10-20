import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'secondary',
  size = 'md',
  animated = true,
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {percentage}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

