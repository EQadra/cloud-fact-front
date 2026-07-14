// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type { User, LoginResponse } from '../types/index';

// =============================================
// INTERFACE DEL CONTEXTO
// =============================================

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  getPermissions: () => string[];
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// =============================================
// CONTEXTO
// =============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================
// HOOK
// =============================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// =============================================
// PROVIDER - VERSIÓN CORREGIDA
// =============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ LOGOUT - Definido primero
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // ✅ REFRESH USER - Definido después de logout
  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error refreshing user:', error);
      if ((error as any)?.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }, [logout]);

  // ✅ EFECTO DE CARGA DE SESIÓN - DEFINIDO DENTRO DEL PROVIDER
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            // ✅ NO llamar a refreshUser aquí - solo restaurar la sesión
            // Si quieres verificar el token, hazlo en segundo plano
          } catch (error) {
            console.error('Error al restaurar sesión:', error);
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [logout]); // ✅ Solo depende de logout

  // ✅ LOGIN
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;

      if (!access_token) {
        throw new Error('No se recibió token de autenticación');
      }

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // ✅ Opcional: refrescar usuario después del login
      // await refreshUser();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      setError(errorMessage);
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ CLEAR ERROR
  const clearError = useCallback(() => setError(null), []);

  // ✅ PERMISSION CHECKS
  const hasPermission = useCallback((permission: string): boolean => {
    return !!user?.permissions?.includes(permission);
  }, [user]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!user?.permissions || permissions.length === 0) return false;
    return permissions.some(p => user.permissions?.includes(p));
  }, [user]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!user?.permissions || permissions.length === 0) return false;
    return permissions.every(p => user.permissions?.includes(p));
  }, [user]);

  const hasRole = useCallback((roleName: string): boolean => {
    return user?.role?.nombre === roleName;
  }, [user]);

  const hasAnyRole = useCallback((roleNames: string[]): boolean => {
    if (!user?.role || roleNames.length === 0) return false;
    return roleNames.includes(user.role.nombre);
  }, [user]);

  const getPermissions = useCallback((): string[] => {
    return user?.permissions || [];
  }, [user]);

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);

  // ✅ VALUE MEMOIZADO
  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getPermissions,
    refreshUser,
    clearError,
  }), [
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getPermissions,
    refreshUser,
    clearError,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}