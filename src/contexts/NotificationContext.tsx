import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // Auto dismiss after this many milliseconds (0 = no auto dismiss)
  position?: 'top' | 'bottom';
  actions?: Array<{
    label: string;
    onClick: () => void;
    style?: 'primary' | 'secondary';
  }>;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message?: string, options?: Partial<Notification>) => string;
  showError: (title: string, message?: string, options?: Partial<Notification>) => string;
  showWarning: (title: string, message?: string, options?: Partial<Notification>) => string;
  showInfo: (title: string, message?: string, options?: Partial<Notification>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      position: 'top', // Default to top
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto dismiss if duration is set
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // Errors don't auto-dismiss by default
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
