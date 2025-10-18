import React from 'react';
import { useUserBalance } from '../hooks/useUserBalance';
import { formatCurrency } from '../utils/helpers';

const BalanceDisplay: React.FC = () => {
  const { balance, loading, error } = useUserBalance();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">Error</span>
      </div>
    );
  }

  const balanceColor = balance <= 0
    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    : balance < 1000
    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${balanceColor} transition-all hover:shadow-md`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <div className="text-left">
        <div className="text-xs font-medium opacity-75">Balance</div>
        <div className="text-sm font-bold leading-tight">{formatCurrency(balance)}</div>
      </div>
    </div>
  );
};

export default BalanceDisplay;





