import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  value: number; // 0-100
  max?: number;
  size?: number; // Diameter in pixels
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  duration?: number;
  className?: string;
}

/**
 * ProgressRing Component
 * 
 * Circular progress indicator with smooth animations
 * GPU-accelerated SVG stroke animation
 * Supports gradient fills and custom styling
 */
const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color,
  trackColor,
  showPercentage = true,
  showLabel = false,
  label,
  animated = true,
  duration = 1000,
  className = '',
}) => {
  const [animatedValue, setAnimatedValue] = useState(animated ? 0 : value);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Animate value on mount or change
  useEffect(() => {
    if (!animated) {
      setAnimatedValue(value);
      return;
    }

    const startValue = animatedValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // EaseOutQuart easing
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, animated, duration]);

  // Calculate SVG properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / max) * circumference;

  // Default colors from design system
  // const defaultColor = color || '#6366F1'; // Primary brand color
  const defaultTrackColor = trackColor || 'rgba(99, 102, 241, 0.1)';

  // Determine text color based on value
  const getStatusColor = () => {
    if (percentage >= 80) return '#10B981'; // Success green
    if (percentage >= 50) return '#6366F1'; // Primary blue
    if (percentage >= 30) return '#F59E0B'; // Warning orange
    return '#EF4444'; // Error red
  };

  const statusColor = color || getStatusColor();

  return (
    <div 
      className={`inline-flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          {/* Gradient for progress stroke */}
          <linearGradient id={`progressGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={statusColor} stopOpacity="1" />
            <stop offset="100%" stopColor={statusColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Background circle (track) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={defaultTrackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#progressGradient-${size})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: animated ? `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
          }}
        />
      </svg>

      {/* Center content */}
      <div 
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        {showPercentage && (
          <div 
            className="text-2xl font-bold"
            style={{ 
              color: statusColor,
              fontSize: size / 5,
            }}
          >
            {Math.round((animatedValue / max) * 100)}%
          </div>
        )}
        {showLabel && label && (
          <div 
            className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] mt-1"
            style={{ fontSize: size / 12 }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;

/**
 * ProgressRingGroup Component
 * 
 * Display multiple progress rings in a row with labels
 */
interface ProgressRingGroupProps {
  rings: Array<{
    label: string;
    value: number;
    max?: number;
    color?: string;
  }>;
  size?: number;
  className?: string;
}

export const ProgressRingGroup: React.FC<ProgressRingGroupProps> = ({
  rings,
  size = 100,
  className = '',
}) => {
  return (
    <div className={`flex gap-6 ${className}`}>
      {rings.map((ring, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <ProgressRing
            value={ring.value}
            max={ring.max}
            size={size}
            color={ring.color}
            showPercentage={true}
            showLabel={false}
          />
          <span className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">
            {ring.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * MiniProgressRing Component
 * 
 * Small progress ring for inline use
 */
interface MiniProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  color?: string;
  className?: string;
}

export const MiniProgressRing: React.FC<MiniProgressRingProps> = ({
  value,
  max = 100,
  size = 40,
  color,
  className = '',
}) => {
  return (
    <ProgressRing
      value={value}
      max={max}
      size={size}
      strokeWidth={4}
      color={color}
      showPercentage={false}
      className={className}
    />
  );
};

