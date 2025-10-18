import React from 'react';
import { mockDashboardMetrics, getOnlineUsers, getRecentActivities } from '../../utils/mockData';

const AdminDashboardHome: React.FC = () => {
  const metrics = mockDashboardMetrics;
  const onlineUsers = getOnlineUsers();
  const recentActivities = getRecentActivities(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="nero-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2">{metrics.users.total}</p>
              <p className="text-blue-100 text-xs mt-1">{metrics.users.online} online now</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="nero-card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold mt-2">{metrics.projects.total}</p>
              <p className="text-green-100 text-xs mt-1">{metrics.projects.activeToday} active today</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="nero-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">PKR {(metrics.financial.totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-purple-100 text-xs mt-1">PKR {metrics.financial.todayRevenue.toLocaleString()} today</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Transactions Today */}
        <div className="nero-card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Transactions</p>
              <p className="text-3xl font-bold mt-2">{metrics.activity.transactionsToday}</p>
              <p className="text-orange-100 text-xs mt-1">processed today</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Online Users */}
        <div className="nero-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Online Users</h2>
            <span className="nero-badge nero-badge-success">{onlineUsers.length} online</span>
          </div>
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-700 rounded-full"></span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button className="nero-btn-secondary text-xs py-1">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="nero-card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;

