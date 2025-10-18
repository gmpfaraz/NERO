import React, { useState } from 'react';
import { useAdminData } from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReports: React.FC = () => {
  const { users, stats, loading } = useAdminData();
  const [reportType, setReportType] = useState<'users' | 'projects' | 'financial' | 'activity'>('users');

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportUsersReport = () => {
    if (!users) return;
    
    const data = users.map(u => ({
      'User ID': u.userId,
      'Display Name': u.displayName,
      'Email': u.email,
      'Balance (PKR)': u.balance,
      'Projects': 0,
      'Total Entries': 0,
      'Status': u.isOnline ? 'Online' : 'Offline',
    }));

    exportToCSV(data, 'users-report');
    alert('✅ Users report exported successfully!');
  };

  const exportFinancialReport = () => {
    if (!users) return;
    
    const data = users.map(u => ({
      'User': u.displayName,
      'Email': u.email,
      'Balance (PKR)': u.balance,
      'Projects Count': 0,
      'Revenue Contribution': u.balance,
    }));

    exportToCSV(data, 'financial-report');
    alert('✅ Financial report exported successfully!');
  };

  const generatePDFReport = () => {
    alert('📄 PDF generation coming soon! For now, use CSV export.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and export comprehensive reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={generatePDFReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportUsersReport}
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="card-premium">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setReportType('users')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              reportType === 'users'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            👥 Users Report
          </button>
          <button
            onClick={() => setReportType('projects')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              reportType === 'projects'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            📁 Projects Report
          </button>
          <button
            onClick={() => setReportType('financial')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              reportType === 'financial'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            💰 Financial Report
          </button>
          <button
            onClick={() => setReportType('activity')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              reportType === 'activity'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            📊 Activity Report
          </button>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'users' && (
        <div className="card-premium animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users Report</h2>
            <button onClick={exportUsersReport} className="btn-primary text-sm">
              Export Users
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">Total Users</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats?.totalUsers || 0}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">Online Users</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats?.onlineUsers || 0}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">Total Projects</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats?.totalProjects || 0}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-700 dark:text-orange-300">Total Balance</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats?.totalBalance.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Projects</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.userId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{user.displayName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-gradient-primary">{user.balance.toLocaleString()} PKR</span>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">0</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isOnline
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}>
                        {user.isOnline ? '🟢 Online' : '⚫ Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'projects' && (
        <div className="card-premium animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Projects Report</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Total Projects: {stats?.totalProjects || 0}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
            <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">📁 Projects Breakdown</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Detailed project analytics coming soon!
            </p>
          </div>
        </div>
      )}

      {reportType === 'financial' && (
        <div className="card-premium animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Report</h2>
            <button onClick={exportFinancialReport} className="btn-success text-sm">
              Export Financial Data
            </button>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl">
              <p className="text-green-100 text-sm mb-2">Total Balance</p>
              <p className="text-4xl font-bold">PKR {stats?.totalBalance.toLocaleString() || 0}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl">
              <p className="text-blue-100 text-sm mb-2">Average per User</p>
              <p className="text-4xl font-bold">
                PKR {users && users.length > 0 ? Math.round(stats!.totalBalance / stats!.totalUsers).toLocaleString() : 0}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl">
              <p className="text-purple-100 text-sm mb-2">Active Accounts</p>
              <p className="text-4xl font-bold">{users?.filter(u => u.balance > 0).length || 0}</p>
            </div>
          </div>

          {/* Top Contributors */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {users && [...users].sort((a, b) => b.balance - a.balance).slice(0, 10).map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gradient-primary">{user.balance.toLocaleString()} PKR</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {reportType === 'activity' && (
        <div className="card-premium animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Activity Report</h2>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 text-center">
            <p className="text-orange-800 dark:text-orange-200 font-semibold mb-2">📊 Activity Tracking</p>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              User activity logs and session tracking coming soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;

