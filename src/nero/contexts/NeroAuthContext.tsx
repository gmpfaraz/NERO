import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NeroUser } from '../types';
import { mockUsers } from '../utils/mockData';

interface NeroAuthContextType {
  user: NeroUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  impersonateUser: (userId: string) => void;
  exitImpersonation: () => void;
  isImpersonating: boolean;
  originalUser: NeroUser | null;
}

const NeroAuthContext = createContext<NeroAuthContextType | undefined>(undefined);

export const NeroAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<NeroUser | null>(null);
  const [originalUser, setOriginalUser] = useState<NeroUser | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nero-current-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Mock login function
  const login = async (email: string, _password: string): Promise<boolean> => {
    // Find user in mock data
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('nero-current-user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setOriginalUser(null);
    setIsImpersonating(false);
    localStorage.removeItem('nero-current-user');
    localStorage.removeItem('nero-impersonation');
  };

  // Impersonate user (admin only)
  const impersonateUser = (userId: string) => {
    if (!user || user.role !== 'admin') return;
    
    const targetUser = mockUsers.find(u => u.id === userId);
    if (targetUser) {
      setOriginalUser(user);
      setUser(targetUser);
      setIsImpersonating(true);
      localStorage.setItem('nero-impersonation', JSON.stringify({ original: user, impersonated: targetUser }));
    }
  };

  // Exit impersonation
  const exitImpersonation = () => {
    if (originalUser) {
      setUser(originalUser);
      setOriginalUser(null);
      setIsImpersonating(false);
      localStorage.removeItem('nero-impersonation');
      localStorage.setItem('nero-current-user', JSON.stringify(originalUser));
    }
  };

  const value: NeroAuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    impersonateUser,
    exitImpersonation,
    isImpersonating,
    originalUser,
  };

  return (
    <NeroAuthContext.Provider value={value}>
      {children}
    </NeroAuthContext.Provider>
  );
};

export const useNeroAuth = (): NeroAuthContextType => {
  const context = useContext(NeroAuthContext);
  if (!context) {
    throw new Error('useNeroAuth must be used within NeroAuthProvider');
  }
  return context;
};

