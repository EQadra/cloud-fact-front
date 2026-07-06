// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredAnyPermissions?: string[];
  requiredRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredAnyPermissions = [],
  requiredRoles = [],
  redirectTo = '/login',
}) => {
  const { isAuthenticated, loading, hasPermission, hasAnyPermission, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar permisos requeridos (todos)
  if (requiredPermissions.length > 0) {
    const hasAllRequired = requiredPermissions.every(p => hasPermission(p));
    if (!hasAllRequired) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Verificar permisos requeridos (al menos uno)
  if (requiredAnyPermissions.length > 0) {
    const hasAnyRequired = requiredAnyPermissions.some(p => hasPermission(p));
    if (!hasAnyRequired) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Verificar roles requeridos (todos)
  if (requiredRoles.length > 0) {
    const hasAllRoles = requiredRoles.every(r => hasRole(r));
    if (!hasAllRoles) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

// Componente para verificar permisos en elementos UI
interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  anyPermissions = [],
  allPermissions = [],
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  }

  if (anyPermissions.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(anyPermissions);
  }

  if (allPermissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(allPermissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};