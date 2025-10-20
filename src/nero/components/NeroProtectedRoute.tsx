import React from 'react';
import { Navigate } from 'react-router-dom';
import { useNeroAuth } from '../contexts/NeroAuthContext';

interface NeroProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const NeroProtectedRoute: React.FC<NeroProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useNeroAuth();

  if (!isAuthenticated) {
    return <Navigate to="/nero/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/nero/user" replace />;
  }

  return <>{children}</>;
};

export default NeroProtectedRoute;

