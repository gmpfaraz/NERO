import React, { useState } from 'react';
import { mockUsers, getUserProjects } from '../../utils/mockData';
import { useNeroAuth } from '../../contexts/NeroAuthContext';
import type { NeroUser } from '../../types';

const AdminUserManagement: React.FC = () => {
  const { impersonateUser } = useNeroAuth();
  const [users] = useState<NeroUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NeroUser | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showUserDetails, setShowUserDetails] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTopUp = (user: NeroUser) => {
    setSelectedUser(user);
    setTopUpAmount('');
    setShowTopUpModal(true);
  };

  const confirmTopUp = () => {
    if (selectedUser && topUpAmount) {
      alert(`✅ Successfully topped up PKR ${topUpAmount} to ${selectedUser.displayName}'s account!`);
      setShowTopUpModal(false);
      setSelectedUser(null);
      setTopUpAmount('');
    }
  };

  const handleViewDetails = (user: NeroUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleImpersonate = (user: NeroUser) => {
    if (confirm(`Impersonate ${user.displayName}? You'll be able to view their dashboard.`)) {
      impersonateUser(user.id);
    }
  };

  const handleDeactivate = (user: NeroUser) => {
    if (confirm(`Deactivate ${user.displayName}'s account?`)) {
      alert(`✅ User ${user.displayName} has been deactivated.`);
    }
  };

  const handleDelete = (user: NeroUser) => {
    if (confirm(`⚠️ Delete ${user.displayName}'s account? This action cannot be undone!`)) {
      alert(`❌ User ${user.displayName} has been deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all users, balances, and permissions
          </p>
        </div>
        <button className="nero-btn-primary">
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="nero-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
        </div>
        <div className="nero-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="nero-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Online Now</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {users.filter(u => u.isOnline).length}
          </p>
        </div>
        <div className="nero-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            PKR {users.reduce((sum, u) => sum + u.balance, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="nero-card">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="nero-input pl-10"
          />
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Users Table */}
      <div className="nero-card overflow-hidden">
        <div className="overflow-x-auto nero-scrollbar">
          <table className="nero-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Spending Limit</th>
                <th>Projects</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const userProjects = getUserProjects(user.id);
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                          {user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          {user.role === 'admin' && (
                            <span className="nero-badge nero-badge-info text-xs mt-1">Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`nero-badge ${user.status === 'active' ? 'nero-badge-success' : 'nero-badge-error'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <p className="font-semibold text-gray-900 dark:text-white">PKR {user.balance.toLocaleString()}</p>
                    </td>
                    <td>
                      <p className="text-gray-700 dark:text-gray-300">PKR {user.spendingLimit.toLocaleString()}</p>
                    </td>
                    <td>
                      <p className="text-gray-700 dark:text-gray-300">{userProjects.length} projects</p>
                    </td>
                    <td>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.lastLoginAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleTopUp(user)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Top Up Balance"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleImpersonate(user)}
                              className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                              title="Impersonate User"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeactivate(user)}
                              className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                              title="Deactivate User"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && selectedUser && (
        <div className="nero-modal-overlay" onClick={() => setShowTopUpModal(false)}>
          <div className="nero-card max-w-md w-full animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Up Balance</h2>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">User</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.displayName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">PKR {selectedUser.balance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Top Up Amount (PKR)
                </label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="nero-input"
                  min="0"
                />
              </div>
              {topUpAmount && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    New Balance: PKR {(selectedUser.balance + parseInt(topUpAmount || '0')).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={confirmTopUp} className="flex-1 nero-btn-primary">
                Confirm Top Up
              </button>
              <button onClick={() => setShowTopUpModal(false)} className="flex-1 nero-btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="nero-modal-overlay" onClick={() => setShowUserDetails(false)}>
          <div className="nero-card max-w-2xl w-full animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.displayName}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{selectedUser.phone}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">PKR {selectedUser.balance.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Spending Limit</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">PKR {selectedUser.spendingLimit.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{getUserProjects(selectedUser.id).length}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`nero-badge ${selectedUser.status === 'active' ? 'nero-badge-success' : 'nero-badge-error'}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              {/* Activity */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Account Info</p>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-600 dark:text-gray-400">Created</span>
                    <span className="text-gray-900 dark:text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-600 dark:text-gray-400">Last Login</span>
                    <span className="text-gray-900 dark:text-white">{new Date(selectedUser.lastLoginAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Role</span>
                    <span className="text-gray-900 dark:text-white capitalize">{selectedUser.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;

