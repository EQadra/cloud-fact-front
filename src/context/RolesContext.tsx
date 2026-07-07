// src/context/RolesContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  Permission,
  RolePermission,
  PaginatedResponse,
  PaginationParams,
} from '../types/index';
// ... resto del código
// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface RolesContextType {
  // Estado
  roles: Role[];
  selectedRole: Role | null;
  permissions: Permission[];
  rolePermissions: RolePermission[];
  loading: boolean;
  error: string | null;
  
  // Paginación
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // CRUD Roles
  fetchRoles: (params?: PaginationParams) => Promise<void>;
  fetchRoleById: (id: string) => Promise<Role>;
  createRole: (data: CreateRoleDto) => Promise<Role>;
  updateRole: (id: string, data: UpdateRoleDto) => Promise<Role>;
  deleteRole: (id: string) => Promise<void>;
  
  // Permisos
  fetchPermissions: () => Promise<void>;
  fetchRolePermissions: (roleId: string) => Promise<RolePermission[]>;
  assignPermissionToRole: (roleId: string, permissionId: string) => Promise<void>;
  removePermissionFromRole: (roleId: string, permissionId: string) => Promise<void>;
  syncRolePermissions: (roleId: string, permissionIds: string[]) => Promise<void>;
  
  // Selección
  selectRole: (role: Role | null) => void;
  clearSelectedRole: () => void;
  
  // Utilitarios
  hasPermission: (roleId: string, permissionName: string) => boolean;
  getRoleByName: (name: string) => Role | undefined;
}

// =============================================
// CONTEXTO
// =============================================

const RolesContext = createContext<RolesContextType | undefined>(undefined);

// =============================================
// PROVIDER
// =============================================

export const RolesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estados principales
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
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
  // FUNCIONES CRUD - ROLES
  // =============================================

  // Obtener todos los roles con paginación
  const fetchRoles = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await api.get<PaginatedResponse<Role>>(`/roles?${queryParams.toString()}`);
      
      setRoles(response.data.data);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los roles';
      setError(errorMessage);
      console.error('Error fetching roles:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un rol por ID
  const fetchRoleById = useCallback(async (id: string): Promise<Role> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Role>(`/roles/${id}`);
      const role = response.data;
      setSelectedRole(role);
      return role;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar el rol';
      setError(errorMessage);
      console.error('Error fetching role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un nuevo rol
  const createRole = useCallback(async (data: CreateRoleDto): Promise<Role> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Role>('/roles', data);
      const newRole = response.data;
      setRoles(prev => [newRole, ...prev]);
      return newRole;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear el rol';
      setError(errorMessage);
      console.error('Error creating role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar un rol
  const updateRole = useCallback(async (id: string, data: UpdateRoleDto): Promise<Role> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Role>(`/roles/${id}`, data);
      const updatedRole = response.data;
      setRoles(prev => prev.map(r => r.id === id ? updatedRole : r));
      if (selectedRole?.id === id) {
        setSelectedRole(updatedRole);
      }
      return updatedRole;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el rol';
      setError(errorMessage);
      console.error('Error updating role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  // Eliminar un rol
  const deleteRole = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/roles/${id}`);
      setRoles(prev => prev.filter(r => r.id !== id));
      if (selectedRole?.id === id) {
        setSelectedRole(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el rol';
      setError(errorMessage);
      console.error('Error deleting role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  // =============================================
  // FUNCIONES DE PERMISOS
  // =============================================

  // Obtener todos los permisos disponibles
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Permission[]>('/permissions');
      setPermissions(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los permisos';
      setError(errorMessage);
      console.error('Error fetching permissions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener permisos de un rol específico
  const fetchRolePermissions = useCallback(async (roleId: string): Promise<RolePermission[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<RolePermission[]>(`/roles/${roleId}/permissions`);
      setRolePermissions(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los permisos del rol';
      setError(errorMessage);
      console.error('Error fetching role permissions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Asignar un permiso a un rol
  const assignPermissionToRole = useCallback(async (roleId: string, permissionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/roles/${roleId}/permissions/${permissionId}`);
      // Recargar permisos del rol
      await fetchRolePermissions(roleId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al asignar el permiso';
      setError(errorMessage);
      console.error('Error assigning permission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRolePermissions]);

  // Remover un permiso de un rol
  const removePermissionFromRole = useCallback(async (roleId: string, permissionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
      // Recargar permisos del rol
      await fetchRolePermissions(roleId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al remover el permiso';
      setError(errorMessage);
      console.error('Error removing permission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRolePermissions]);

  // Sincronizar todos los permisos de un rol (reemplazar lista completa)
  const syncRolePermissions = useCallback(async (roleId: string, permissionIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/roles/${roleId}/permissions`, { permissionIds });
      // Recargar permisos del rol
      await fetchRolePermissions(roleId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al sincronizar los permisos';
      setError(errorMessage);
      console.error('Error syncing permissions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRolePermissions]);

  // =============================================
  // FUNCIONES DE SELECCIÓN
  // =============================================

  const selectRole = useCallback((role: Role | null) => {
    setSelectedRole(role);
    if (role) {
      fetchRolePermissions(role.id);
    } else {
      setRolePermissions([]);
    }
  }, [fetchRolePermissions]);

  const clearSelectedRole = useCallback(() => {
    setSelectedRole(null);
    setRolePermissions([]);
  }, []);

  // =============================================
  // FUNCIONES UTILITARIAS
  // =============================================

  // Verificar si un rol tiene un permiso específico
  const hasPermission = useCallback((roleId: string, permissionName: string): boolean => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return false;
    return role.permissions?.some(
      rp => rp.permission.nombre === permissionName
    ) || false;
  }, [roles]);

  // Obtener un rol por su nombre
  const getRoleByName = useCallback((name: string): Role | undefined => {
    return roles.find(r => r.nombre.toLowerCase() === name.toLowerCase());
  }, [roles]);

  // =============================================
  // EFECTOS
  // =============================================

  // Cargar roles al montar el componente
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // =============================================
  // VALUE DEL CONTEXTO
  // =============================================

  const value: RolesContextType = {
    // Estado
    roles,
    selectedRole,
    permissions,
    rolePermissions,
    loading,
    error,
    
    // Paginación
    pagination,
    
    // CRUD Roles
    fetchRoles,
    fetchRoleById,
    createRole,
    updateRole,
    deleteRole,
    
    // Permisos
    fetchPermissions,
    fetchRolePermissions,
    assignPermissionToRole,
    removePermissionFromRole,
    syncRolePermissions,
    
    // Selección
    selectRole,
    clearSelectedRole,
    
    // Utilitarios
    hasPermission,
    getRoleByName,
  };

  return (
    <RolesContext.Provider value={value}>
      {children}
    </RolesContext.Provider>
  );
};

// =============================================
// HOOK PERSONALIZADO
// =============================================

export const useRoles = (): RolesContextType => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};