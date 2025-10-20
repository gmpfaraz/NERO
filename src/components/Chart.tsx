import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  type?: 'line' | 'area' | 'bar';
  color?: string;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Chart Component - Lightweight Data Visualization
 * 
 * Native SVG charts with no dependencies
 * Supports line, area, and bar charts
 * Animated with smooth transitions
 * Design system compliant
 */
const Chart: React.FC<ChartProps> = ({
  data,
  type = 'area',
  color = '#6366F1',
  height = 200,
  showGrid = true,
  showLabels = true,
  // showTooltip = false,
  animated = true,
  className = '',
}) => {
  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: showLabels ? 40 : 20, left: 40 };
  const chartWidth = 100; // Use percentage for responsiveness
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value), 0);
  const valueRange = maxValue - minValue;

  const getX = (index: number) => {
    return (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / valueRange) * chartHeight;
  };

  // Generate path for line/area
  const generatePath = () => {
    if (data.length === 0) return '';

    let path = `M ${getX(0)} ${getY(data[0].value)}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = getX(i);
      const y = getY(data[i].value);
      
      // Smooth curve using quadratic bezier
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1].value);
      const cpX = (prevX + x) / 2;
      
      path += ` Q ${cpX} ${prevY}, ${x} ${y}`;
    }

    return path;
  };

  const linePath = generatePath();

  // Generate area path (close the path to bottom)
  const generateAreaPath = () => {
    if (data.length === 0) return '';
    
    let path = linePath;
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottom = chartHeight;
    
    path += ` L ${lastX} ${bottom} L ${firstX} ${bottom} Z`;
    return path;
  };

  const areaPath = generateAreaPath();

  // Grid lines
  const gridLines = showGrid ? [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y = chartHeight * ratio;
    const value = maxValue - (valueRange * ratio);
    return { y, value };
  }) : [];

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${height}`}
        className="w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id={`areaGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
          
          {/* Gradient for line */}
          <linearGradient id={`lineGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1="0"
                y1={line.y}
                x2={chartWidth}
                y2={line.y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-[#E5E7EB] dark:text-[#2D3040]"
                opacity="0.5"
              />
              <text
                x="-10"
                y={line.y}
                dy="0.3em"
                textAnchor="end"
                fontSize="10"
                className="fill-[#6B7280] dark:fill-[#9CA3AF]"
              >
                {Math.round(line.value)}
              </text>
            </g>
          ))}

          {/* Area chart */}
          {type === 'area' && (
            <path
              d={areaPath}
              fill={`url(#areaGradient-${color})`}
              style={{
                animation: animated ? 'drawArea 1.5s ease-out' : 'none',
              }}
            />
          )}

          {/* Line chart */}
          {(type === 'line' || type === 'area') && (
            <path
              d={linePath}
              fill="none"
              stroke={`url(#lineGradient-${color})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: animated ? '1000' : 'none',
                strokeDashoffset: animated ? '1000' : '0',
                animation: animated ? 'drawLine 1.5s ease-out forwards' : 'none',
              }}
            />
          )}

          {/* Data points */}
          {(type === 'line' || type === 'area') && data.map((point, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(point.value)}
              r="4"
              fill={color}
              className="cursor-pointer hover:r-5 transition-all"
              style={{
                opacity: animated ? 0 : 1,
                animation: animated ? `fadeIn 0.3s ease-out ${0.5 + i * 0.05}s forwards` : 'none',
              }}
            >
              <title>{`${point.label}: ${point.value}`}</title>
            </circle>
          ))}

          {/* Bar chart */}
          {type === 'bar' && data.map((point, i) => {
            const barWidth = (chartWidth / data.length) * 0.8;
            const barX = getX(i) - barWidth / 2;
            const barHeight = chartHeight - getY(point.value);
            const barY = getY(point.value);

            return (
              <rect
                key={i}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="4"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  animation: animated ? `growBar 0.6s ease-out ${i * 0.1}s both` : 'none',
                }}
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </rect>
            );
          })}

          {/* X-axis labels */}
          {showLabels && data.map((point, i) => {
            // Show every nth label to avoid crowding
            const showLabel = data.length <= 7 || i % Math.ceil(data.length / 7) === 0;
            if (!showLabel) return null;

            return (
              <text
                key={i}
                x={getX(i)}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="11"
                className="fill-[#6B7280] dark:fill-[#9CA3AF]"
              >
                {point.label}
              </text>
            );
          })}

          {/* X-axis line */}
          <line
            x1="0"
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="currentColor"
            strokeWidth="1"
            className="text-[#E5E7EB] dark:text-[#2D3040]"
          />

          {/* Y-axis line */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={chartHeight}
            stroke="currentColor"
            strokeWidth="1"
            className="text-[#E5E7EB] dark:text-[#2D3040]"
          />
        </g>
      </svg>
    </div>
  );
};

export default Chart;

/**
 * MiniSparkline Component
 * 
 * Compact inline trend indicator
 * No axes, labels, or grid
 */
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

export const MiniSparkline: React.FC<SparklineProps> = ({
  data,
  color = '#6366F1',
  height = 40,
  className = '',
}) => {
  if (!data || data.length === 0) return null;

  const width = 100;
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const getX = (index: number) => (index / (data.length - 1)) * width;
  const getY = (value: number) => height - ((value - minValue) / range) * height;

  let path = `M ${getX(0)} ${getY(data[0])}`;
  for (let i = 1; i < data.length; i++) {
    path += ` L ${getX(i)} ${getY(data[i])}`;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`w-full ${className}`}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

