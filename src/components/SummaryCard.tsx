import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'secondary',
  onClick,
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary to-primary-light',
    secondary: 'bg-gradient-to-br from-secondary to-secondary-light',
    accent: 'bg-gradient-to-br from-accent to-accent-light',
    success: 'bg-gradient-to-br from-green-500 to-green-600',
    warning: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    danger: 'bg-gradient-to-br from-red-500 to-red-600',
  };

  return (
    <div
      onClick={onClick}
      className={`card ${onClick ? 'cursor-pointer hover:shadow-xl' : ''} transition-all duration-200 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`w-32 h-32 rounded-full ${colorClasses[color]} absolute -top-8 -right-8`} />
        <div className={`w-24 h-24 rounded-full ${colorClasses[color]} absolute -bottom-4 -left-4`} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          {icon && (
            <div className={`p-2 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>

        {/* Subtitle or Trend */}
        {(subtitle || trend) && (
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
                {trend.isPositive ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;

