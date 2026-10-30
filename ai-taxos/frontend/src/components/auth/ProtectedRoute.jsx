import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return children;
};
