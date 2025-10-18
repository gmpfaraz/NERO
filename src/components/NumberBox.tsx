import React from 'react';
import type { NumberSummary } from '../types';

interface NumberBoxProps {
  summary: NumberSummary;
  isHighest?: boolean;
  isLowest?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

const NumberBox: React.FC<NumberBoxProps> = ({
  summary,
  isHighest = false,
  isLowest = false,
  onClick,
  isSelected = false,
}) => {
  const total = summary.firstTotal + summary.secondTotal;
  const hasFirst = summary.firstTotal > 0;
  const hasSecond = summary.secondTotal > 0;
  const hasEntries = summary.entryCount > 0;

  // Color coding based on PRD requirements
  const getBorderColor = () => {
    if (isHighest) return 'border-danger'; // Red for highest
    if (isLowest && hasEntries) return 'border-gray-300 dark:border-gray-600'; // White/gray for lowest
    if (hasFirst && !hasSecond) return 'border-success'; // Green for FIRST only
    if (!hasFirst && hasSecond) return 'border-warning'; // Yellow for SECOND only
    if (hasFirst && hasSecond) return 'border-secondary'; // Blue for both
    return 'border-gray-200 dark:border-gray-700'; // Default gray
  };

  const getBackgroundColor = () => {
    if (isSelected) return 'bg-secondary bg-opacity-10';
    if (!hasEntries) return 'bg-gray-50 dark:bg-gray-800';
    return 'bg-white dark:bg-gray-800';
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${getBackgroundColor()}
        ${getBorderColor()}
        border-2 rounded-lg p-3 transition-all duration-200
        hover:shadow-md hover:scale-105 active:scale-95
        text-left w-full min-h-[100px]
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${isSelected ? 'ring-2 ring-secondary ring-offset-2' : ''}
      `}
      disabled={!onClick}
    >
      {/* Number */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">
          {summary.number}
        </span>
        {hasEntries && (
          <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium">
            {summary.entryCount}
          </span>
        )}
      </div>

      {/* Amounts */}
      {hasEntries ? (
        <div className="space-y-1">
          {hasFirst && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400 font-medium">FIRST</span>
              <span className="font-mono font-bold text-success">
                {summary.firstTotal.toLocaleString()}
              </span>
            </div>
          )}
          {hasSecond && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400 font-medium">SECOND</span>
              <span className="font-mono font-bold text-warning">
                {summary.secondTotal.toLocaleString()}
              </span>
            </div>
          )}
          <div className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400 font-medium">TOTAL</span>
              <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-600 text-xs mt-2">
          No entries
        </div>
      )}

      {/* Special indicators */}
      {isHighest && hasEntries && (
        <div className="absolute top-1 right-1">
          <span className="text-xs bg-danger text-white px-1.5 py-0.5 rounded">
            HIGH
          </span>
        </div>
      )}
      {isLowest && hasEntries && (
        <div className="absolute top-1 right-1">
          <span className="text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded">
            LOW
          </span>
        </div>
      )}
    </button>
  );
};

export default NumberBox;

