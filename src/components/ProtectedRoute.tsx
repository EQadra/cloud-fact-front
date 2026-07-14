// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  // Nuevo: permitir acceso sin verificar permisos (solo autenticación)
  requireAuthOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [],
  requireAuthOnly = false
}) => {
  const { isAuthenticated, loading, hasAllPermissions, user } = useAuth();

  console.log('🔒 ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('🔒 ProtectedRoute - loading:', loading);
  console.log('🔒 ProtectedRoute - user:', user);
  console.log('🔒 ProtectedRoute - requiredPermissions:', requiredPermissions);
  console.log('🔒 ProtectedRoute - requireAuthOnly:', requireAuthOnly);

  // Mientras carga, muestra un loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f172a',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTop: '3px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#94a3b8' }}>Verificando acceso...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si no está autenticado, redirige a login
  if (!isAuthenticated) {
    console.log('🔒 Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Si solo requiere autenticación (sin permisos específicos)
  if (requireAuthOnly) {
    console.log('🔒 Solo requiere autenticación, acceso permitido');
    return <>{children}</>;
  }

  // Si requiere permisos específicos
  if (requiredPermissions.length > 0) {
    const hasAccess = hasAllPermissions(requiredPermissions);
    console.log('🔒 hasAllPermissions result:', hasAccess);
    
    if (!hasAccess) {
      console.log('🚫 Usuario sin permisos suficientes, redirigiendo a /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Si todo está bien, muestra el contenido
  console.log('✅ Acceso permitido');
  return <>{children}</>;
};