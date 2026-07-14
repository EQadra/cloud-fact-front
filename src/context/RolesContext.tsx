// src/context/RolesContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  Permission,
  RolePermission,
  PaginationParams,
} from '../types/index';

// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface RolesContextType {
  roles: Role[];
  selectedRole: Role | null;
  permissions: Permission[];
  rolePermissions: RolePermission[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchRoles: (params?: PaginationParams) => Promise<void>;
  fetchRoleById: (id: string) => Promise<Role>;
  createRole: (data: CreateRoleDto) => Promise<Role>;
  updateRole: (id: string, data: UpdateRoleDto) => Promise<Role>;
  deleteRole: (id: string) => Promise<void>;
  fetchPermissions: () => Promise<void>;
  fetchRolePermissions: (roleId: string) => Promise<RolePermission[]>;
  assignPermissionsToRole: (roleId: string, permissionIds: string[]) => Promise<void>;
  removePermissionFromRole: (roleId: string, permissionId: string) => Promise<void>;
  selectRole: (role: Role | null) => void;
  clearSelectedRole: () => void;
  hasPermission: (roleId: string, permissionName: string) => boolean;
  getRoleByName: (name: string) => Role | undefined;
  clearError: () => void;
}

// =============================================
// CONTEXTO
// =============================================

const RolesContext = createContext<RolesContextType | undefined>(undefined);

// =============================================
// HOOK
// =============================================

export const useRoles = (): RolesContextType => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};

// =============================================
// PROVIDER - SIN useEffect
// =============================================

export const RolesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // =============================================
  // FUNCIONES CRUD - ROLES
  // =============================================

  const fetchRoles = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await api.get(`/roles?${queryParams.toString()}`);
      
      console.log('📦 Respuesta roles:', response.data);
      
      let rolesData = [];
      let total = 0;
      let currentPage = params?.page || 1;
      let totalPages = 1;
      let limit = params?.limit || 10;

      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          rolesData = response.data.data;
          if (response.data.meta) {
            total = response.data.meta.total || 0;
            currentPage = response.data.meta.page || 1;
            totalPages = response.data.meta.totalPages || 1;
            limit = response.data.meta.limit || 10;
          }
        } else if (Array.isArray(response.data)) {
          rolesData = response.data;
          total = response.data.length;
          totalPages = 1;
        } else if (response.data.roles && Array.isArray(response.data.roles)) {
          rolesData = response.data.roles;
          total = response.data.total || response.data.roles.length;
          totalPages = 1;
        } else {
          rolesData = Array.isArray(response.data) ? response.data : [];
        }
      }

      setRoles(rolesData);
      setPagination({
        page: currentPage,
        limit: limit,
        total: total,
        totalPages: totalPages,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los roles';
      setError(errorMessage);
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const updateRole = useCallback(async (id: string, data: UpdateRoleDto): Promise<Role> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Role>(`/roles/${id}`, data);
      const updatedRole = response.data;
      setRoles(prev => prev.map(r => r.id === id ? updatedRole : r));
      if (selectedRole?.id === id) setSelectedRole(updatedRole);
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

  const deleteRole = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/roles/${id}`);
      setRoles(prev => prev.filter(r => r.id !== id));
      if (selectedRole?.id === id) setSelectedRole(null);
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
  // FUNCIONES DE PERMISOS - CORREGIDAS PARA TU BACKEND
  // =============================================

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
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRolePermissions = useCallback(async (roleId: string): Promise<RolePermission[]> => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Usar GET /roles/:id/permissions (existe en tu backend)
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

  // ✅ Asignar múltiples permisos a un rol - Usa POST /roles/:id/permissions/bulk
  const assignPermissionsToRole = useCallback(async (roleId: string, permissionIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Usar POST /roles/:id/permissions/bulk (existe en tu backend)
      await api.post(`/roles/${roleId}/permissions/bulk`, { permissionIds });
      await fetchRolePermissions(roleId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al asignar los permisos';
      setError(errorMessage);
      console.error('Error assigning permissions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRolePermissions]);

  // ✅ Remover un permiso de un rol - Usa DELETE /roles/:id/permissions/:permissionId
  const removePermissionFromRole = useCallback(async (roleId: string, permissionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Usar DELETE /roles/:id/permissions/:permissionId (existe en tu backend)
      await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
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

  const hasPermission = useCallback((roleId: string, permissionName: string): boolean => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return false;
    return role.permissions?.some(
      rp => rp.permission?.nombre === permissionName
    ) || false;
  }, [roles]);

  const getRoleByName = useCallback((name: string): Role | undefined => {
    return roles.find(r => r.nombre.toLowerCase() === name.toLowerCase());
  }, [roles]);

  const clearError = useCallback(() => setError(null), []);

  // =============================================
  // ✅ SIN useEffect - Los datos se cargan desde el componente
  // =============================================

  const value: RolesContextType = {
    roles,
    selectedRole,
    permissions,
    rolePermissions,
    loading,
    error,
    pagination,
    fetchRoles,
    fetchRoleById,
    createRole,
    updateRole,
    deleteRole,
    fetchPermissions,
    fetchRolePermissions,
    assignPermissionsToRole,        // ✅ Cambiado para usar bulk
    removePermissionFromRole,
    selectRole,
    clearSelectedRole,
    hasPermission,
    getRoleByName,
    clearError,
  };

  return (
    <RolesContext.Provider value={value}>
      {children}
    </RolesContext.Provider>
  );
};