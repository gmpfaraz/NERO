import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, User, SignUpCredentials, SignInCredentials } from '../types/auth';
import { supabase, isOfflineMode } from '../lib/supabase';
import { generateId } from '../utils/helpers';
import { saveRecentLogin } from '../utils/recentLogins';
import { saveCredential } from '../utils/savedCredentials';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'gull-auth-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isOfflineMode()) {
          // Load user from localStorage in offline mode
          const storedUser = localStorage.getItem(STORAGE_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else if (supabase) {
          // Get current session from Supabase
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const authUser: User = {
              id: session.user.id,
              email: session.user.email || null,
              displayName: session.user.user_metadata?.displayName || null,
              isAnonymous: session.user.is_anonymous || false,
              createdAt: session.user.created_at || new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            setUser(authUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
            saveRecentLogin(authUser); // Save to recent logins
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              const authUser: User = {
                id: session.user.id,
                email: session.user.email || null,
                displayName: session.user.user_metadata?.displayName || null,
                isAnonymous: session.user.is_anonymous || false,
                createdAt: session.user.created_at || new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              };
              setUser(authUser);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
              saveRecentLogin(authUser); // Save to recent logins
            } else {
              setUser(null);
              localStorage.removeItem(STORAGE_KEY);
            }
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (credentials: SignUpCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOfflineMode()) {
        // Create offline user
        const newUser: User = {
          id: generateId(),
          email: credentials.email,
          displayName: credentials.displayName || null,
          isAnonymous: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } else if (supabase) {
        // Sign up with Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              displayName: credentials.displayName || null,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const authUser: User = {
            id: data.user.id,
            email: data.user.email || null,
            displayName: credentials.displayName || null,
            isAnonymous: false,
            createdAt: data.user.created_at || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
          setUser(authUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

          // Create profile row for admin listing (best-effort)
          try {
            await supabase.from('profiles').upsert({
              user_id: authUser.id,
              email: authUser.email,
              display_name: authUser.displayName,
              role: (authUser.email && authUser.email.toLowerCase() === 'gmpfaraz@gmail.com') ? 'admin' : 'user',
            });
          } catch {}
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: SignInCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOfflineMode()) {
        // Load offline user
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const existingUser = JSON.parse(storedUser);
          if (existingUser.email === credentials.email) {
            existingUser.lastLoginAt = new Date().toISOString();
            setUser(existingUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser));
          } else {
            throw new Error('User not found');
          }
        } else {
          throw new Error('No user found. Please sign up first.');
        }
      } else if (supabase) {
        // Sign in with Supabase
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          const authUser: User = {
            id: data.user.id,
            email: data.user.email || null,
            displayName: data.user.user_metadata?.displayName || null,
            isAnonymous: false,
            createdAt: data.user.created_at || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
          setUser(authUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
          saveRecentLogin(authUser); // Save to recent logins
          // Save credentials for quick switching
          saveCredential(credentials.email, credentials.password);

          // Ensure profile exists
          try {
            await supabase.from('profiles').upsert({
              user_id: authUser.id,
              email: authUser.email,
              display_name: authUser.displayName,
              role: (authUser.email && authUser.email.toLowerCase() === 'gmpfaraz@gmail.com') ? 'admin' : 'user',
            });
          } catch {}
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signInAnonymously = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const anonymousUser: User = {
        id: generateId(),
        email: null,
        displayName: 'Guest User',
        isAnonymous: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      if (isOfflineMode()) {
        // Always create anonymous user in offline mode
        setUser(anonymousUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(anonymousUser));
      } else if (supabase) {
        // Try Supabase anonymous sign in (if supported)
        try {
          const { data, error: anonError } = await supabase.auth.signInAnonymously();
          
          if (anonError) throw anonError;

          if (data.user) {
            const authUser: User = {
              id: data.user.id,
              email: null,
              displayName: 'Guest User',
              isAnonymous: true,
              createdAt: data.user.created_at || new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            setUser(authUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
          }
        } catch {
          // Fallback to local anonymous user if Supabase doesn't support it
          setUser(anonymousUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(anonymousUser));
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Anonymous sign in failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (supabase && !isOfflineMode()) {
        await supabase.auth.signOut();
      }
      
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      
      // Clear all project data (optional - you might want to keep local data)
      // localStorage.clear();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (displayName: string) => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = { ...user, displayName };

      if (isOfflineMode()) {
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      } else if (supabase) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { displayName },
        });

        if (updateError) throw updateError;
        
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInAnonymously,
    signOut,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

