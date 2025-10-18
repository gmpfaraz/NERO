import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentLogins, removeRecentLogin, type RecentLogin } from '../utils/recentLogins';
import { getCredential } from '../utils/savedCredentials';
import { useAuth } from '../contexts/AuthContext';

interface AccountSwitcherProps {
  onSwitch?: () => void;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ onSwitch }) => {
  const [recentLogins, setRecentLogins] = useState<RecentLogin[]>(getRecentLogins());
  const { user, signOut, signIn } = useAuth();
  const navigate = useNavigate();

  const handleRemove = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentLogin(email);
    setRecentLogins(getRecentLogins());
  };

  const handleSwitch = async (login: RecentLogin) => {
    if (login.email === user?.email) {
      return; // Already logged in as this user
    }

    // Check if we have saved credentials
    const savedPassword = getCredential(login.email || '');
    
    if (savedPassword && login.email) {
      try {
        // Auto-login with saved credentials
        await signOut();
        await signIn({ email: login.email, password: savedPassword });
        
        // Navigate to home
        navigate('/');
        onSwitch?.();
      } catch (error) {
        console.error('Auto-login failed:', error);
        alert(`Failed to switch to ${login.email}. Please try signing in manually.`);
      }
    } else {
      // No saved credentials, need to sign in manually
      alert(`Please sign in with ${login.email} to switch accounts.`);
      onSwitch?.();
    }
  };

  if (recentLogins.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Recent Accounts
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {recentLogins.length} saved
        </span>
      </div>

      <div className="space-y-2">
        {recentLogins.map((login) => (
          <div
            key={login.id}
            onClick={() => handleSwitch(login)}
            className={`
              group relative flex items-center gap-3 p-3 rounded-xl
              border transition-all duration-200 cursor-pointer
              ${
                login.email === user?.email
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-main dark:hover:border-primary-light hover:shadow-md'
              }
            `}
          >
            {/* Avatar */}
            <div
              className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                ${
                  login.email === user?.email
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-br from-primary-main to-primary-dark text-white'
                }
              `}
            >
              {(login.displayName || login.email).charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {login.displayName || login.email.split('@')[0]}
                </p>
                {login.email === user?.email && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {login.email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                {login.device}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={(e) => handleRemove(login.email, e)}
              className="
                flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
                p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                text-gray-400 hover:text-red-600 dark:hover:text-red-400
              "
              title="Remove from recent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Active Indicator */}
            {login.email === user?.email && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-l-xl" />
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Click any account to switch instantly
      </p>
    </div>
  );
};

export default AccountSwitcher;

