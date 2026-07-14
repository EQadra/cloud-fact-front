// src/context/PermissionsContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  Permission,
  CreatePermissionDto,
  PaginationParams,
} from '../types/index';

// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface PermissionsContextType {
  permissions: Permission[];
  selectedPermission: Permission | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchPermissions: (params?: PaginationParams) => Promise<void>;
  fetchPermissionById: (id: string) => Promise<Permission>;
  createPermission: (data: CreatePermissionDto) => Promise<Permission>;
  updatePermission: (id: string, data: Partial<CreatePermissionDto>) => Promise<Permission>;
  deletePermission: (id: string) => Promise<void>;
  selectPermission: (permission: Permission | null) => void;
  clearSelectedPermission: () => void;
  getPermissionsByModule: (module: string) => Permission[];
  getPermissionByName: (name: string) => Permission | undefined;
  groupPermissionsByModule: () => Record<string, Permission[]>;
  searchPermissions: (query: string) => Permission[];
  clearError: () => void;
}

// =============================================
// CONTEXTO
// =============================================

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// =============================================
// HOOK PERSONALIZADO - RENOMBRADO
// =============================================

export const usePermissionsContext = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
};

// =============================================
// PROVIDER - SIN useEffect
// =============================================

export const PermissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // =============================================
  // FUNCIONES CRUD - PERMISOS
  // =============================================

  const fetchPermissions = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await api.get(`/permissions?${queryParams.toString()}`);
      
      console.log('📦 Respuesta permisos:', response.data);
      
      let permissionsData = [];
      let total = 0;
      let currentPage = params?.page || 1;
      let totalPages = 1;
      let limit = params?.limit || 10;

      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          permissionsData = response.data.data;
          if (response.data.meta) {
            total = response.data.meta.total || 0;
            currentPage = response.data.meta.page || 1;
            totalPages = response.data.meta.totalPages || 1;
            limit = response.data.meta.limit || 10;
          }
        } else if (Array.isArray(response.data)) {
          permissionsData = response.data;
          total = response.data.length;
          totalPages = 1;
        } else if (response.data.permissions && Array.isArray(response.data.permissions)) {
          permissionsData = response.data.permissions;
          total = response.data.total || response.data.permissions.length;
          totalPages = 1;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          permissionsData = response.data.items;
          total = response.data.total || response.data.items.length;
          totalPages = 1;
        } else {
          permissionsData = Array.isArray(response.data) ? response.data : [];
        }
      }

      setPermissions(permissionsData);
      setPagination({
        page: currentPage,
        limit: limit,
        total: total,
        totalPages: totalPages,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los permisos';
      setError(errorMessage);
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissionById = useCallback(async (id: string): Promise<Permission> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Permission>(`/permissions/${id}`);
      const permission = response.data;
      setSelectedPermission(permission);
      return permission;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar el permiso';
      setError(errorMessage);
      console.error('Error fetching permission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPermission = useCallback(async (data: CreatePermissionDto): Promise<Permission> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Permission>('/permissions', data);
      const newPermission = response.data;
      setPermissions(prev => [newPermission, ...prev]);
      return newPermission;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear el permiso';
      setError(errorMessage);
      console.error('Error creating permission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePermission = useCallback(async (id: string, data: Partial<CreatePermissionDto>): Promise<Permission> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Permission>(`/permissions/${id}`, data);
      const updatedPermission = response.data;
      setPermissions(prev => prev.map(p => p.id === id ? updatedPermission : p));
      if (selectedPermission?.id === id) {
        setSelectedPermission(updatedPermission);
      }
      return updatedPermission;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el permiso';
      setError(errorMessage);
      console.error('Error updating permission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPermission]);

  const deletePermission = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/permissions/${id}`);
      setPermissions(prev => prev.filter(p => p.id !== id));
      if (selectedPermission?.id === id) {
        setSelectedPermission(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el permiso';
      setError(errorMessage);
      console.error('Error deleting permission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPermission]);

  // =============================================
  // FUNCIONES DE SELECCIÓN
  // =============================================

  const selectPermission = useCallback((permission: Permission | null) => {
    setSelectedPermission(permission);
  }, []);

  const clearSelectedPermission = useCallback(() => {
    setSelectedPermission(null);
  }, []);

  // =============================================
  // FUNCIONES UTILITARIAS
  // =============================================

  const getPermissionsByModule = useCallback((module: string): Permission[] => {
    return permissions.filter(p => p.modulo === module);
  }, [permissions]);

  const getPermissionByName = useCallback((name: string): Permission | undefined => {
    return permissions.find(p => p.nombre === name);
  }, [permissions]);

  const groupPermissionsByModule = useCallback((): Record<string, Permission[]> => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(permission => {
      const module = permission.modulo || 'general';
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(permission);
    });
    return grouped;
  }, [permissions]);

  const searchPermissions = useCallback((query: string): Permission[] => {
    const lowerQuery = query.toLowerCase();
    return permissions.filter(p => 
      p.nombre.toLowerCase().includes(lowerQuery) ||
      p.descripcion?.toLowerCase().includes(lowerQuery) ||
      p.modulo?.toLowerCase().includes(lowerQuery)
    );
  }, [permissions]);

  const clearError = useCallback(() => setError(null), []);

  // =============================================
  // ❌ SIN useEffect - Los datos se cargan desde el componente
  // =============================================

  const value: PermissionsContextType = {
    permissions,
    selectedPermission,
    loading,
    error,
    pagination,
    fetchPermissions,
    fetchPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    selectPermission,
    clearSelectedPermission,
    getPermissionsByModule,
    getPermissionByName,
    groupPermissionsByModule,
    searchPermissions,
    clearError,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};