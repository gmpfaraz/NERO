import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AccountSwitcher from '../components/AccountSwitcher';
import { isOfflineMode } from '../lib/supabase';

const Welcome: React.FC = () => {
  const location = useLocation();
  const [mode, setMode] = useState<'welcome' | 'signin' | 'signup'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  
  const { signIn, signUp, loading, error, clearError } = useAuth();

  // Check if switching to another account
  useEffect(() => {
    const state = location.state as { switchTo?: string } | null;
    if (state?.switchTo) {
      setMode('signin');
      setEmail(state.switchTo);
      // Clear the state
      navigate('/welcome', { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign in failed');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp({ email, password, displayName: displayName || undefined });
      navigate('/');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign up failed');
    }
  };

  if (loading && mode === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">GULL</h1>
          <p className="text-xl text-white/90">Accounting Management System</p>
          {isOfflineMode() && (
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-400 rounded-lg">
              <p className="text-sm text-yellow-200">
                🔒 Offline Mode - Data stored locally
              </p>
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className="card shadow-2xl">
          {mode === 'welcome' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
                Welcome to GULL
              </h2>
              
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Professional accounting management for Akra and Ring entries
              </p>

              <button
                onClick={() => setMode('signin')}
                className="w-full btn-primary py-3 text-lg"
              >
                Sign In
              </button>

              <button
                onClick={() => setMode('signup')}
                className="w-full btn-secondary py-3"
              >
                Create Account
              </button>

              {/* Recent Logins Section */}
              <AccountSwitcher />
            </div>
          )}

          {mode === 'signin' && (
            <div>
              <button
                onClick={() => {
                  setMode('welcome');
                  setFormError('');
                  clearError();
                }}
                className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Sign In
              </h2>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                {(formError || error) && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {formError || error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setFormError('');
                    clearError();
                  }}
                  className="text-secondary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>

              {/* Show recent accounts */}
              <AccountSwitcher />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <button
                onClick={() => {
                  setMode('welcome');
                  setFormError('');
                  clearError();
                }}
                className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Create Account
              </h2>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-field"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                </div>

                {(formError || error) && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {formError || error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    setFormError('');
                    clearError();
                  }}
                  className="text-secondary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>

              {/* Show recent accounts */}
              <AccountSwitcher />
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-white/70 mt-8">
          © 2025 GULL. Professional Accounting Management.
        </p>
      </div>
    </div>
  );
};

export default Welcome;

