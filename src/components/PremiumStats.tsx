import React from 'react';
import type { NumberSummary } from '../types';

interface PremiumStatsProps {
  summaries: Map<string, NumberSummary>;
  selectedNumbers: Set<string>;
  showSelected?: boolean;
}

const PremiumStats: React.FC<PremiumStatsProps> = ({ 
  summaries, 
  selectedNumbers,
  showSelected = false 
}) => {
  // Calculate statistics
  const dataToUse = showSelected && selectedNumbers.size > 0
    ? Array.from(selectedNumbers).map(num => summaries.get(num)).filter(Boolean) as NumberSummary[]
    : Array.from(summaries.values());

  const firstTotal = dataToUse.reduce((sum, s) => sum + s.firstTotal, 0);
  const secondTotal = dataToUse.reduce((sum, s) => sum + s.secondTotal, 0);
  const firstEntries = dataToUse.reduce((sum, s) => {
    return sum + s.transactions.filter(t => t.first > 0).length;
  }, 0);
  const secondEntries = dataToUse.reduce((sum, s) => {
    return sum + s.transactions.filter(t => t.second > 0).length;
  }, 0);
  const uniqueNumbers = dataToUse.length;
  const totalPkr = firstTotal + secondTotal;

  const stats = [
    {
      label: 'First PKR',
      value: firstTotal.toLocaleString(),
      subLabel: 'First Entry',
      subValue: firstEntries,
      icon: '💰',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-950/30 to-teal-950/30',
    },
    {
      label: 'Second PKR',
      value: secondTotal.toLocaleString(),
      subLabel: 'Second Entry',
      subValue: secondEntries,
      icon: '💵',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      darkBgGradient: 'from-blue-950/30 to-cyan-950/30',
    },
    {
      label: 'Unique Numbers',
      value: uniqueNumbers,
      subLabel: 'Total Numbers',
      subValue: summaries.size,
      icon: '🔢',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBgGradient: 'from-purple-950/30 to-pink-950/30',
    },
    {
      label: 'Total PKR',
      value: totalPkr.toLocaleString(),
      subLabel: 'Grand Total',
      subValue: `${firstEntries + secondEntries} entries`,
      icon: '💎',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      darkBgGradient: 'from-amber-950/30 to-orange-950/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="card group relative overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Hover gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          {/* Content */}
          <div className="relative">
            {/* Icon and decoration */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl filter drop-shadow-lg">
                {stat.icon}
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity`}></div>
            </div>
            
            {/* Main value */}
            <div className="mb-3">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {stat.label}
              </div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
            </div>
            
            {/* Sub value with better visibility */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {stat.subLabel}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {stat.subValue}
              </span>
            </div>
          </div>
          
          {/* Colored left border accent */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${stat.gradient} opacity-75 group-hover:w-1.5 transition-all duration-300`}></div>
        </div>
      ))}
      
      {showSelected && selectedNumbers.size > 0 && (
        <div className="col-span-full">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Showing statistics for {selectedNumbers.size} selected numbers</span>
              </div>
              <div className="text-sm opacity-90">
                Total: {uniqueNumbers} numbers with entries
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumStats;

