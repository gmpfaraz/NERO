import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Optional: Log access attempts for analytics/debugging
    if (!loading && !user) {
      console.log('Redirecting to welcome page:', location.pathname);
    }
  }, [loading, user, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to welcome page, save the attempted location
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

