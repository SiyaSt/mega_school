import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="protected-loading">
        <div className="protected-loading-spinner" />
        <p>Загрузка…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?redirectTo=${redirectTo}`} replace />;
  }

  return <>{children}</>;
};
