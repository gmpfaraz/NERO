import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../config/admin';
import BackButton from './BackButton';
import ThemeToggle from './ThemeToggle';
import BalanceDisplay from './BalanceDisplay';
import ProfileDropdown from './ProfileDropdown';

interface ProjectHeaderProps {
  projectName: string;
  projectDate?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  projectDate,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user ? isAdminEmail(user.email) : false;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back Button and Project Info */}
          <div className="flex items-center space-x-4">
            <BackButton to={isAdmin ? "/admin" : "/"} label={isAdmin ? "Admin Panel" : "Projects"} />
            <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {projectName}
              </h1>
              {projectDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {projectDate}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Balance Display for Regular Users */}
            {!isAdmin && <BalanceDisplay />}

            {/* Admin Panel Button for Admins */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin Panel</span>
                <span className="text-xs opacity-75">👑</span>
              </button>
            )}

            {/* Undo/Redo Buttons */}
            {(onUndo || onRedo) && (
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={`p-2 rounded transition-colors ${
                    canUndo
                      ? 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className={`p-2 rounded transition-colors ${
                    canRedo
                      ? 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                  title="Redo (Ctrl+Y)"
                  aria-label="Redo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>
            )}

            <ProfileDropdown />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
