import React from 'react';
import { GlassmorphicCard } from './GlassmorphicCard';

interface GlassStatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  icon?: React.ReactNode;
  colorScheme?: 'blue' | 'pink' | 'purple' | 'mint' | 'gray';
  className?: string;
}

/**
 * GlassStatCard Component
 * 
 * A glassmorphic stat card displaying key metrics with large numbers and optional trend indicators.
 * Follows the design system specifications for stat cards with proper typography hierarchy.
 * 
 * Design System Features:
 * - Large bold numbers (3rem, 700 weight)
 * - Trend badges with colored backgrounds and arrow icons
 * - Generous padding (1.5rem)
 * - Border radius (1.25rem to 1.5rem)
 * - Min height of 160px
 * 
 * @example
 * ```tsx
 * <GlassStatCard
 *   label="Total applicants"
 *   value="+120"
 *   trend={{ value: "24%", direction: "up" }}
 *   subtitle="vs last week"
 *   colorScheme="blue"
 * />
 * ```
 */
export const GlassStatCard: React.FC<GlassStatCardProps> = ({
  label,
  value,
  trend,
  subtitle,
  icon,
  colorScheme = 'blue',
  className = '',
}) => {
  const getTrendBadgeClass = () => {
    switch (trend?.direction) {
      case 'up':
        return 'trend-badge-positive';
      case 'down':
        return 'trend-badge-negative';
      default:
        return 'trend-badge-neutral';
    }
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '•';
    }
  };

  const getBackgroundColor = () => {
    const colors = {
      blue: 'bg-pastel-blue-50',
      pink: 'bg-pastel-pink-50',
      purple: 'bg-pastel-purple-50',
      mint: 'bg-pastel-mint-50',
      gray: 'bg-pastel-gray-50',
    };
    return colors[colorScheme];
  };

  return (
    <GlassmorphicCard
      className={`p-6 rounded-xl min-h-[160px] flex flex-col justify-between ${getBackgroundColor()} ${className}`}
    >
      {/* Top Row: Label and Icon */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-glass-secondary">{label}</p>
        {icon && <div className="text-glass-tertiary">{icon}</div>}
      </div>

      {/* Main Value */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-5xl font-bold text-glass-primary leading-none mb-2">
          {value}
        </div>
      </div>

      {/* Bottom Row: Trend and Subtitle */}
      <div className="flex items-center gap-2 mt-3">
        {trend && (
          <span className={getTrendBadgeClass()}>
            <span className="text-xs">{getTrendIcon()}</span>
            <span>{trend.value}</span>
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-glass-tertiary">{subtitle}</span>
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default GlassStatCard;


