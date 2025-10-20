import React, { useMemo } from 'react';
import NumberBox from './NumberBox';
import type { NumberSummary, EntryType } from '../types';
import { getAllPossibleNumbers, getHighestLowestNumbers } from '../utils/transactionHelpers';

interface NumberGridProps {
  summaries: Map<string, NumberSummary>;
  entryType: EntryType;
  onNumberClick?: (number: string) => void;
  searchQuery?: string;
  selectedNumbers?: Set<string>;
  onSelectionChange?: (numbers: Set<string>) => void;
  selectionMode?: boolean;
}

const NumberGrid: React.FC<NumberGridProps> = ({
  summaries,
  entryType,
  onNumberClick,
  searchQuery = '',
  selectedNumbers = new Set(),
  onSelectionChange,
  selectionMode = false,
}) => {
  const allNumbers = useMemo(() => getAllPossibleNumbers(entryType), [entryType]);
  const { highest, lowest } = useMemo(() => getHighestLowestNumbers(summaries), [summaries]);

  // Filter numbers based on search query
  const filteredNumbers = useMemo(() => {
    if (!searchQuery) return allNumbers;
    
    const query = searchQuery.toLowerCase().trim();
    return allNumbers.filter(num => {
      // Direct match
      if (num.includes(query)) return true;
      
      // Wildcard pattern matching
      if (query.includes('*')) {
        const regex = new RegExp('^' + query.replace(/\*/g, '.*') + '$');
        return regex.test(num);
      }
      
      return false;
    });
  }, [allNumbers, searchQuery]);

  // Get summary or create empty one
  const getSummary = (number: string): NumberSummary => {
    return summaries.get(number) || {
      number,
      firstTotal: 0,
      secondTotal: 0,
      entryCount: 0,
      transactions: [],
    };
  };

  const handleNumberClick = (number: string) => {
    if (selectionMode) {
      const newSelection = new Set(selectedNumbers);
      if (newSelection.has(number)) {
        newSelection.delete(number);
      } else {
        newSelection.add(number);
      }
      onSelectionChange?.(newSelection);
    } else {
      onNumberClick?.(number);
    }
  };

  // Calculate grid columns based on entry type
  const gridCols = entryType === 'akra' 
    ? 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-10'
    : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10';

  return (
    <div className="space-y-4">
      {/* Statistics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Numbers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {filteredNumbers.length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">With Entries</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {summaries.size}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Selected</p>
          <p className="text-2xl font-bold text-secondary">
            {selectedNumbers.size}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Coverage</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round((summaries.size / allNumbers.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Number Grid */}
      <div className={`grid ${gridCols} gap-3`}>
        {filteredNumbers.map(number => {
          const summary = getSummary(number);
          return (
            <NumberBox
              key={number}
              summary={summary}
              isHighest={number === highest}
              isLowest={number === lowest}
              onClick={() => handleNumberClick(number)}
              isSelected={selectedNumbers.has(number)}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNumbers.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No numbers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
};

export default NumberGrid;

