// src/context/PermissionsContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  Permission,
  CreatePermissionDto,
  PaginatedResponse,
  PaginationParams,
} from '../types/index';
// ... resto del código

// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface PermissionsContextType {
  // Estado
  permissions: Permission[];
  selectedPermission: Permission | null;
  loading: boolean;
  error: string | null;
  
  // Paginación
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // CRUD Permisos
  fetchPermissions: (params?: PaginationParams) => Promise<void>;
  fetchPermissionById: (id: string) => Promise<Permission>;
  createPermission: (data: CreatePermissionDto) => Promise<Permission>;
  updatePermission: (id: string, data: Partial<CreatePermissionDto>) => Promise<Permission>;
  deletePermission: (id: string) => Promise<void>;
  
  // Selección
  selectPermission: (permission: Permission | null) => void;
  clearSelectedPermission: () => void;
  
  // Utilitarios
  getPermissionsByModule: (module: string) => Permission[];
  getPermissionByName: (name: string) => Permission | undefined;
  groupPermissionsByModule: () => Record<string, Permission[]>;
  searchPermissions: (query: string) => Permission[];
}

// =============================================
// CONTEXTO
// =============================================

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// =============================================
// PROVIDER
// =============================================

export const PermissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estados principales
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // =============================================
  // FUNCIONES CRUD - PERMISOS
  // =============================================

  // Obtener todos los permisos con paginación
  const fetchPermissions = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await api.get<PaginatedResponse<Permission>>(`/permissions?${queryParams.toString()}`);
      
      setPermissions(response.data.data);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los permisos';
      setError(errorMessage);
      console.error('Error fetching permissions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un permiso por ID
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

  // Crear un nuevo permiso
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

  // Actualizar un permiso
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

  // Eliminar un permiso
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

  // Obtener permisos por módulo
  const getPermissionsByModule = useCallback((module: string): Permission[] => {
    return permissions.filter(p => p.modulo === module);
  }, [permissions]);

  // Obtener un permiso por nombre
  const getPermissionByName = useCallback((name: string): Permission | undefined => {
    return permissions.find(p => p.nombre === name);
  }, [permissions]);

  // Agrupar permisos por módulo
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

  // Buscar permisos
  const searchPermissions = useCallback((query: string): Permission[] => {
    const lowerQuery = query.toLowerCase();
    return permissions.filter(p => 
      p.nombre.toLowerCase().includes(lowerQuery) ||
      p.descripcion?.toLowerCase().includes(lowerQuery) ||
      p.modulo?.toLowerCase().includes(lowerQuery)
    );
  }, [permissions]);

  // =============================================
  // EFECTOS
  // =============================================

  // Cargar permisos al montar el componente
  useEffect(() => {
    fetchPermissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // =============================================
  // VALUE DEL CONTEXTO
  // =============================================

  const value: PermissionsContextType = {
    // Estado
    permissions,
    selectedPermission,
    loading,
    error,
    
    // Paginación
    pagination,
    
    // CRUD Permisos
    fetchPermissions,
    fetchPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    
    // Selección
    selectPermission,
    clearSelectedPermission,
    
    // Utilitarios
    getPermissionsByModule,
    getPermissionByName,
    groupPermissionsByModule,
    searchPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

// =============================================
// HOOK PERSONALIZADO
// =============================================

export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};