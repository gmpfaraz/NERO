import React from 'react';

interface AnimatedIconProps {
  type: 'success' | 'error' | 'loading' | 'info' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * AnimatedIcon Component
 * 
 * Provides animated icons for various states:
 * - Success: Checkmark with draw-in animation
 * - Error: X with shake animation
 * - Loading: Spinner with gradient rotation
 * - Info: Circle-i with pulse
 * - Warning: Triangle with attention pulse
 */
const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  type, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  // const sizeValue = {
  //   sm: 16,
  //   md: 24,
  //   lg: 40,
  //   xl: 64,
  // };

  // const currentSize = sizeValue[size];
  const currentClass = sizeClasses[size];

  if (type === 'success') {
    return (
      <svg
        className={`${currentClass} ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background */}
        <circle
          cx="12"
          cy="12"
          r="10"
          className="fill-[#10B981] dark:fill-[#059669]"
          style={{
            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        {/* Checkmark path */}
        <path
          d="M8 12.5l2.5 2.5L16 9"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 12,
            strokeDashoffset: 12,
            animation: 'drawCheck 0.5s ease-out 0.2s forwards',
          }}
        />
      </svg>
    );
  }

  if (type === 'error') {
    return (
      <svg
        className={`${currentClass} ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        }}
      >
        {/* Circle background */}
        <circle
          cx="12"
          cy="12"
          r="10"
          className="fill-[#EF4444] dark:fill-[#DC2626]"
        />
        {/* X paths */}
        <path
          d="M15 9L9 15"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 8.5,
            strokeDashoffset: 8.5,
            animation: 'drawX 0.3s ease-out 0.2s forwards',
          }}
        />
        <path
          d="M9 9L15 15"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 8.5,
            strokeDashoffset: 8.5,
            animation: 'drawX 0.3s ease-out 0.35s forwards',
          }}
        />
      </svg>
    );
  }

  if (type === 'loading') {
    return (
      <svg
        className={`${currentClass} ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <defs>
          <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#spinnerGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="20"
        />
      </svg>
    );
  }

  if (type === 'info') {
    return (
      <svg
        className={`${currentClass} ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          className="fill-[#3B82F6] dark:fill-[#2563EB]"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <path
          d="M12 8V8.01M12 12V16"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'warning') {
    return (
      <svg
        className={`${currentClass} ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'attentionPulse 1.5s ease-in-out infinite',
        }}
      >
        <path
          d="M12 2L2 20h20L12 2z"
          className="fill-[#F59E0B] dark:fill-[#D97706]"
        />
        <path
          d="M12 9V13M12 17V17.01"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return null;
};

export default AnimatedIcon;

// Helper component for inline usage
export const SuccessIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ size, className }) => (
  <AnimatedIcon type="success" size={size} className={className} />
);

export const ErrorIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ size, className }) => (
  <AnimatedIcon type="error" size={size} className={className} />
);

export const LoadingIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ size, className }) => (
  <AnimatedIcon type="loading" size={size} className={className} />
);

export const InfoIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ size, className }) => (
  <AnimatedIcon type="info" size={size} className={className} />
);

export const WarningIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ size, className }) => (
  <AnimatedIcon type="warning" size={size} className={className} />
);

