import React from 'react';

interface GlassChartBarProps {
  value: number;
  maxValue?: number;
  label?: string;
  colorScheme?: 'blue' | 'pink' | 'purple' | 'gray' | 'mint';
  pattern?: 'dots' | 'stripes' | 'none';
  height?: string;
  className?: string;
  showValue?: boolean;
}

/**
 * GlassChartBar Component
 * 
 * A bar chart element with gradient fills and optional decorative pattern overlays.
 * Implements the design system specifications for data visualization.
 * 
 * Design System Features:
 * - Gradient fills (light to dark, top to bottom)
 * - Pattern overlays (dots for actual data, stripes for projected data)
 * - Rounded corners (0.5rem on top)
 * - Hover effects (scale 1.05, brightness 110%)
 * - Bar width: 20px to 40px
 * - Min height: 20px, Max height: 200px
 * 
 * @example
 * ```tsx
 * <GlassChartBar
 *   value={75}
 *   maxValue={100}
 *   label="Screening"
 *   colorScheme="blue"
 *   pattern="dots"
 * />
 * ```
 */
export const GlassChartBar: React.FC<GlassChartBarProps> = ({
  value,
  maxValue = 100,
  label,
  colorScheme = 'blue',
  pattern = 'none',
  height = '200px',
  className = '',
  showValue = true,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const barHeight = `${percentage}%`;

  const getBarColorClass = () => {
    const colors = {
      blue: 'chart-bar-blue',
      pink: 'chart-bar-pink',
      purple: 'chart-bar-purple',
      gray: 'chart-bar-gray',
      mint: 'chart-bar-mint',
    };
    return colors[colorScheme];
  };

  const getPatternClass = () => {
    if (pattern === 'dots') return 'chart-bar-with-dots';
    if (pattern === 'stripes') return 'chart-bar-with-stripes';
    return '';
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Chart Bar Container */}
      <div
        className="w-8 md:w-10 flex items-end justify-center rounded-t-lg overflow-hidden"
        style={{ height }}
      >
        <div
          className={`w-full rounded-t-lg transition-all duration-300 hover:scale-105 hover:brightness-110 ${getBarColorClass()} ${getPatternClass()}`}
          style={{ height: barHeight, minHeight: percentage > 0 ? '20px' : '0' }}
        >
          {/* Value Display Inside Bar (optional) */}
          {showValue && percentage > 20 && (
            <div className="flex items-start justify-center pt-2">
              <span className="text-xs font-semibold text-white drop-shadow">
                {value}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Label Below Bar */}
      {label && (
        <div className="text-center">
          <p className="text-xs text-glass-tertiary whitespace-nowrap">{label}</p>
          {showValue && percentage <= 20 && (
            <p className="text-sm font-semibold text-glass-primary">{value}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GlassChartBar;


