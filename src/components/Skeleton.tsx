import React from 'react';

/**
 * Skeleton Loading Components
 * 
 * Provides beautiful skeleton screens for loading states
 * Uses shimmer animation with design system colors
 */

interface SkeletonBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

// Base Skeleton with shimmer animation
export const SkeletonBase: React.FC<SkeletonBaseProps> = ({ className = '', style }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#F3F4F6] via-[#E5E7EB] to-[#F3F4F6] dark:from-[#2D3040] dark:via-[#3A3D52] dark:to-[#2D3040] ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s ease-in-out infinite',
        ...style,
      }}
    />
  );
};

// Skeleton Text Line
interface SkeletonTextProps {
  width?: string;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ width = '100%', className = '' }) => {
  return (
    <SkeletonBase
      className={`h-4 rounded-md ${className}`}
      style={{ width }}
    />
  );
};

// Skeleton Avatar/Circle
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <SkeletonBase className={`${sizeClasses[size]} rounded-full ${className}`} />
  );
};

// Skeleton Card
interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div 
      className={`bg-[#FFFFFF] dark:bg-[#252837] border border-[#E5E7EB] dark:border-[#2D3040] rounded-[1rem] p-6 ${className}`}
      style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)' }}
    >
      <SkeletonText width="60%" className="mb-4" />
      <SkeletonText width="100%" className="mb-2" />
      <SkeletonText width="100%" className="mb-2" />
      <SkeletonText width="80%" />
    </div>
  );
};

// Skeleton Widget (for stats)
interface SkeletonWidgetProps {
  className?: string;
}

export const SkeletonWidget: React.FC<SkeletonWidgetProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-[#FFFFFF] dark:bg-[#252837] border border-[#E5E7EB] dark:border-[#2D3040] rounded-[1rem] p-6 ${className}`}
      style={{ 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
        minHeight: '120px'
      }}
    >
      <SkeletonText width="40%" className="mb-3" />
      <SkeletonText width="70%" className="h-8 mb-2" />
      <SkeletonText width="50%" />
    </div>
  );
};

// Skeleton Project Card
export const SkeletonProjectCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-[#FFFFFF] dark:bg-[#252837] border border-[#E5E7EB] dark:border-[#2D3040] rounded-[1rem] p-6 ${className}`}
      style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <SkeletonText width="150px" className="h-6" />
        <SkeletonText width="80px" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <SkeletonText width="60px" className="mb-2" />
          <SkeletonText width="100px" className="h-6" />
        </div>
        <div>
          <SkeletonText width="60px" className="mb-2" />
          <SkeletonText width="100px" className="h-6" />
        </div>
      </div>

      {/* Progress bar */}
      <SkeletonBase className="h-2 rounded-full mb-4" />

      {/* Action buttons */}
      <div className="flex gap-2">
        <SkeletonBase className="h-10 flex-1 rounded-lg" />
        <SkeletonBase className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
};

// Skeleton Table Row
export const SkeletonTableRow: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-4 p-4 ${className}`}>
      <SkeletonAvatar size="sm" />
      <div className="flex-1">
        <SkeletonText width="40%" className="mb-2" />
        <SkeletonText width="60%" />
      </div>
      <SkeletonText width="80px" />
      <SkeletonText width="100px" />
    </div>
  );
};

// Skeleton Grid (for number grids)
interface SkeletonGridProps {
  count?: number;
  columns?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ 
  count = 12, 
  columns = 4,
  className = '' 
}) => {
  return (
    <div 
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBase 
          key={i} 
          className="h-24 rounded-lg"
        />
      ))}
    </div>
  );
};

// CSS for shimmer animation (add to index.css)
// @keyframes shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }

export default {
  Base: SkeletonBase,
  Text: SkeletonText,
  Avatar: SkeletonAvatar,
  Card: SkeletonCard,
  Widget: SkeletonWidget,
  ProjectCard: SkeletonProjectCard,
  TableRow: SkeletonTableRow,
  Grid: SkeletonGrid,
};

