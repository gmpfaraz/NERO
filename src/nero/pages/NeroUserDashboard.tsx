import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NeroLayout from '../components/NeroLayout';
import type { SidebarItem } from '../components/NeroSidebar';
import { useNeroAuth } from '../contexts/NeroAuthContext';
import { getUserProjects } from '../utils/mockData';

const UserDashboardHome: React.FC = () => {
  const { user } = useNeroAuth();
  const projects = getUserProjects(user?.id || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.displayName}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your account overview</p>
        </div>
        <div className="nero-card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 text-sm">Available Balance</p>
          <p className="text-3xl font-bold">PKR {user?.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="nero-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="nero-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Spending Limit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">PKR {user?.spendingLimit.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="nero-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Status</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{user?.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="nero-card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No projects yet. Create your first project!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  <span className={`nero-badge ${project.status === 'active' ? 'nero-badge-success' : 'nero-badge-info'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{project.entryCount} entries</span>
                  <span className="font-semibold text-gray-900 dark:text-white">PKR {(project.totalFirst + project.totalSecond).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NeroUserDashboard: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/nero/user',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'My Projects',
      path: '/nero/user/projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      path: '/nero/user/transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/nero/user/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <NeroLayout sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<UserDashboardHome />} />
        <Route path="projects" element={<div className="nero-card"><h2 className="text-xl font-bold">My Projects (Coming in Phase 4)</h2></div>} />
        <Route path="transactions" element={<div className="nero-card"><h2 className="text-xl font-bold">Transactions (Coming in Phase 4)</h2></div>} />
        <Route path="reports" element={<div className="nero-card"><h2 className="text-xl font-bold">Reports (Coming in Phase 4)</h2></div>} />
        <Route path="*" element={<Navigate to="/nero/user" replace />} />
      </Routes>
    </NeroLayout>
  );
};

export default NeroUserDashboard;

