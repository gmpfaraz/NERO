import React, { useState, useMemo } from 'react';
import { useAdminData } from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminFinancial: React.FC = () => {
  const { users, loading } = useAdminData();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Calculate financial metrics
  const metrics = useMemo(() => {
    if (!users) return null;

    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
    const avgBalance = totalBalance / users.length;
    const topUsers = [...users].sort((a, b) => b.balance - a.balance).slice(0, 5);
    const lowBalanceUsers = users.filter(u => u.balance < 1000);

    return {
      totalBalance,
      avgBalance,
      topUsers,
      lowBalanceUsers,
      usersWithBalance: users.filter(u => u.balance > 0).length,
      usersWithoutBalance: users.filter(u => u.balance === 0).length,
    };
  }, [users]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track balances, transactions, and financial metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'today'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'week'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'month'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">PKR {metrics.totalBalance.toLocaleString()}</p>
          <p className="text-blue-200 text-sm mt-2">Across all users</p>
        </div>

        <div className="card-premium bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm font-medium">Average Balance</p>
            <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">PKR {Math.round(metrics.avgBalance).toLocaleString()}</p>
          <p className="text-green-200 text-sm mt-2">Per user average</p>
        </div>

        <div className="card-premium bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100 text-sm font-medium">Active Accounts</p>
            <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{metrics.usersWithBalance}</p>
          <p className="text-purple-200 text-sm mt-2">Users with balance</p>
        </div>

        <div className="card-premium bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-sm font-medium">Low Balance</p>
            <svg className="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{metrics.lowBalanceUsers.length}</p>
          <p className="text-orange-200 text-sm mt-2">Below PKR 1,000</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users by Balance */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Top Users by Balance</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
              Top 5
            </span>
          </div>
          <div className="space-y-4">
            {metrics.topUsers.map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gradient-primary">
                    {user.balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PKR</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Balance Users */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Low Balance Alerts</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full">
              {metrics.lowBalanceUsers.length} Users
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {metrics.lowBalanceUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">✅ No low balance users</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">All users have balance above PKR 1,000</p>
              </div>
            ) : (
              metrics.lowBalanceUsers.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{user.displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600 dark:text-orange-400">
                      {user.balance.toLocaleString()} PKR
                    </p>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1">
                      Top Up
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Balance Distribution Chart (Simple bars) */}
      <div className="card-premium">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Balance Distribution</h2>
        <div className="space-y-4">
          {[
            { range: '0 PKR', count: metrics.usersWithoutBalance, color: 'bg-red-500' },
            { range: '1 - 1,000 PKR', count: users?.filter(u => u.balance > 0 && u.balance <= 1000).length || 0, color: 'bg-orange-500' },
            { range: '1,001 - 5,000 PKR', count: users?.filter(u => u.balance > 1000 && u.balance <= 5000).length || 0, color: 'bg-yellow-500' },
            { range: '5,001 - 10,000 PKR', count: users?.filter(u => u.balance > 5000 && u.balance <= 10000).length || 0, color: 'bg-blue-500' },
            { range: '10,000+ PKR', count: users?.filter(u => u.balance > 10000).length || 0, color: 'bg-green-500' },
          ].map((item) => (
            <div key={item.range}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.range}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.count} users</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className={`${item.color} h-4 rounded-full transition-all duration-500 flex items-center justify-end px-2`}
                  style={{ width: `${(item.count / (users?.length || 1)) * 100}%` }}
                >
                  <span className="text-xs text-white font-semibold">
                    {Math.round((item.count / (users?.length || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFinancial;

