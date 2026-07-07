// src/context/UsersContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  Role,
  Company,
  Branch,
  PaginatedResponse,
  PaginationParams,
  UserFilters,
  UserStatistics,
  AuditLog,
} from '../types/index';
import { useAuth } from './AuthContext';
// ... resto del código
// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface UsersContextType {
  // ===== ESTADO PRINCIPAL =====
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  
  // ===== PAGINACIÓN =====
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // ===== DATOS RELACIONADOS =====
  roles: Role[];
  companies: Company[];
  branches: Branch[];
  
  // ===== CRUD USUARIOS =====
  fetchUsers: (params?: PaginationParams & UserFilters) => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  createUser: (data: CreateUserDto) => Promise<User>;
  updateUser: (id: string, data: UpdateUserDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<User>;
  
  // ===== DATOS RELACIONADOS =====
  fetchRoles: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  fetchBranches: (companyId?: string) => Promise<void>;
  
  // ===== SELECCIÓN =====
  selectUser: (user: User | null) => void;
  clearSelectedUser: () => void;
  
  // ===== ESTADÍSTICAS =====
  getUserStatistics: (filters?: UserFilters) => Promise<UserStatistics>;
  
  // ===== AUDITORÍA =====
  getUserAuditLogs: (userId: string, params?: PaginationParams) => Promise<AuditLog[]>;
  
  // ===== GESTIÓN DE CONTRASEÑAS =====
  resetUserPassword: (id: string) => Promise<void>;
  changeUserPassword: (id: string, currentPassword: string, newPassword: string) => Promise<void>;
  
  // ===== EXPORTAR/IMPORTAR =====
  exportUsers: (filters?: UserFilters) => Promise<Blob>;
  importUsers: (file: File) => Promise<User[]>;
  
  // ===== UTILITARIOS =====
  searchUsers: (query: string) => User[];
  getUsersByRole: (roleId: string) => User[];
  getUsersByCompany: (companyId: string) => User[];
  getActiveUsers: () => User[];
  getInactiveUsers: () => User[];
  getUserByEmail: (email: string) => User | undefined;
  getUserByDocument: (document: string) => User | undefined;
  
  // ===== LIMPIAR ERROR =====
  clearError: () => void;
}

// =============================================
// CONTEXTO
// =============================================

const UsersContext = createContext<UsersContextType | undefined>(undefined);

// =============================================
// PROVIDER
// =============================================

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ===== OBTENER AUTH =====
  const { hasPermission } = useAuth();

  // ===== ESTADOS PRINCIPALES =====
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ===== PAGINACIÓN =====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  // ===== DATOS RELACIONADOS =====
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // =============================================
  // FUNCIONES CRUD - USUARIOS
  // =============================================

  // Obtener todos los usuarios con filtros y paginación
  const fetchUsers = useCallback(async (params?: PaginationParams & UserFilters) => {
    // Verificar permisos
    if (!hasPermission('users.view')) {
      setError('No tienes permiso para ver usuarios');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      
      // Paginación
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Búsqueda
      if (params?.search) queryParams.append('search', params.search);
      
      // Filtros
      if (params?.roleId) queryParams.append('roleId', params.roleId);
      if (params?.companyId) queryParams.append('companyId', params.companyId);
      if (params?.estado !== undefined) queryParams.append('estado', String(params.estado));
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get<PaginatedResponse<User>>(`/users?${queryParams.toString()}`);
      
      setUsers(response.data.data);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los usuarios';
      setError(errorMessage);
      console.error('Error fetching users:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // Obtener un usuario por ID
  const fetchUserById = useCallback(async (id: string): Promise<User> => {
    if (!hasPermission('users.view')) {
      throw new Error('No tienes permiso para ver usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get<User>(`/users/${id}`);
      const user = response.data;
      setSelectedUser(user);
      return user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar el usuario';
      setError(errorMessage);
      console.error('Error fetching user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // Crear un nuevo usuario
  const createUser = useCallback(async (data: CreateUserDto): Promise<User> => {
    if (!hasPermission('users.create')) {
      throw new Error('No tienes permiso para crear usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.post<User>('/users', data);
      const newUser = response.data;
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear el usuario';
      setError(errorMessage);
      console.error('Error creating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // Actualizar un usuario
  const updateUser = useCallback(async (id: string, data: UpdateUserDto): Promise<User> => {
    if (!hasPermission('users.edit')) {
      throw new Error('No tienes permiso para editar usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<User>(`/users/${id}`, data);
      const updatedUser = response.data;
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (selectedUser?.id === id) {
        setSelectedUser(updatedUser);
      }
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el usuario';
      setError(errorMessage);
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser, hasPermission]);

  // Eliminar un usuario (soft delete)
  const deleteUser = useCallback(async (id: string): Promise<void> => {
    if (!hasPermission('users.delete')) {
      throw new Error('No tienes permiso para eliminar usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el usuario';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser, hasPermission]);

  // Cambiar estado del usuario (activar/desactivar)
  const toggleUserStatus = useCallback(async (id: string): Promise<User> => {
    if (!hasPermission('users.toggle-status')) {
      throw new Error('No tienes permiso para cambiar el estado de usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<User>(`/users/${id}/toggle-status`);
      const updatedUser = response.data;
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (selectedUser?.id === id) {
        setSelectedUser(updatedUser);
      }
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado del usuario';
      setError(errorMessage);
      console.error('Error toggling user status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser, hasPermission]);

  // =============================================
  // FUNCIONES - DATOS RELACIONADOS
  // =============================================

  // Obtener todos los roles
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Role[]>('/roles');
      setRoles(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los roles';
      setError(errorMessage);
      console.error('Error fetching roles:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas las empresas
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Company[]>('/companies');
      setCompanies(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar las empresas';
      setError(errorMessage);
      console.error('Error fetching companies:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener sucursales por empresa
  const fetchBranches = useCallback(async (companyId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = companyId ? `/branches?companyId=${companyId}` : '/branches';
      const response = await api.get<Branch[]>(url);
      setBranches(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar las sucursales';
      setError(errorMessage);
      console.error('Error fetching branches:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================================
  // FUNCIONES DE SELECCIÓN
  // =============================================

  const selectUser = useCallback((user: User | null) => {
    setSelectedUser(user);
  }, []);

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  // =============================================
  // ESTADÍSTICAS
  // =============================================

  const getUserStatistics = useCallback(async (filters?: UserFilters): Promise<UserStatistics> => {
    if (!hasPermission('users.view')) {
      throw new Error('No tienes permiso para ver estadísticas de usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters?.roleId) queryParams.append('roleId', filters.roleId);
      if (filters?.companyId) queryParams.append('companyId', filters.companyId);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);
      
      const response = await api.get<UserStatistics>(`/users/statistics?${queryParams.toString()}`);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al obtener estadísticas';
      setError(errorMessage);
      console.error('Error fetching user statistics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // =============================================
  // AUDITORÍA
  // =============================================

  const getUserAuditLogs = useCallback(async (userId: string, params?: PaginationParams): Promise<AuditLog[]> => {
    if (!hasPermission('users.view')) {
      throw new Error('No tienes permiso para ver logs de auditoría');
    }

    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await api.get<AuditLog[]>(`/users/${userId}/audit-logs?${queryParams.toString()}`);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los logs de auditoría';
      setError(errorMessage);
      console.error('Error fetching audit logs:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // =============================================
  // GESTIÓN DE CONTRASEÑAS
  // =============================================

  const resetUserPassword = useCallback(async (id: string): Promise<void> => {
    if (!hasPermission('users.edit')) {
      throw new Error('No tienes permiso para restablecer contraseñas');
    }

    setLoading(true);
    setError(null);
    try {
      await api.post(`/users/${id}/reset-password`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al restablecer la contraseña';
      setError(errorMessage);
      console.error('Error resetting password:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  const changeUserPassword = useCallback(async (id: string, currentPassword: string, newPassword: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/users/${id}/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar la contraseña';
      setError(errorMessage);
      console.error('Error changing password:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================================
  // EXPORTAR/IMPORTAR
  // =============================================

  const exportUsers = useCallback(async (filters?: UserFilters): Promise<Blob> => {
    if (!hasPermission('users.view')) {
      throw new Error('No tienes permiso para exportar usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters?.roleId) queryParams.append('roleId', filters.roleId);
      if (filters?.companyId) queryParams.append('companyId', filters.companyId);
      if (filters?.estado !== undefined) queryParams.append('estado', String(filters.estado));
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);
      
      const response = await api.get(`/users/export?${queryParams.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al exportar usuarios';
      setError(errorMessage);
      console.error('Error exporting users:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  const importUsers = useCallback(async (file: File): Promise<User[]> => {
    if (!hasPermission('users.create')) {
      throw new Error('No tienes permiso para importar usuarios');
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<User[]>('/users/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Recargar la lista de usuarios
      await fetchUsers();
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al importar usuarios';
      setError(errorMessage);
      console.error('Error importing users:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, hasPermission]);

  // =============================================
  // LIMPIAR ERROR
  // =============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // =============================================
  // FUNCIONES UTILITARIAS
  // =============================================

  // Buscar usuarios por texto
  const searchUsers = useCallback((query: string): User[] => {
    const lowerQuery = query.toLowerCase();
    return users.filter(u =>
      u.nombre.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery) ||
      u.telefono?.toLowerCase().includes(lowerQuery)
    );
  }, [users]);

  // Obtener usuarios por rol
  const getUsersByRole = useCallback((roleId: string): User[] => {
    return users.filter(u => u.roleId === roleId);
  }, [users]);

  // Obtener usuarios por empresa
  const getUsersByCompany = useCallback((companyId: string): User[] => {
    return users.filter(u => u.companyId === companyId);
  }, [users]);

  // Obtener usuarios activos
  const getActiveUsers = useCallback((): User[] => {
    return users.filter(u => u.estado !== false);
  }, [users]);

  // Obtener usuarios inactivos
  const getInactiveUsers = useCallback((): User[] => {
    return users.filter(u => u.estado === false);
  }, [users]);

  // Obtener usuario por email
  const getUserByEmail = useCallback((email: string): User | undefined => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }, [users]);

  // Obtener usuario por documento
  const getUserByDocument = useCallback((document: string): User | undefined => {
    return users.find(u => (u as any).documento === document);
  }, [users]);

  // =============================================
  // EFECTOS
  // =============================================

  // Cargar datos iniciales
  useEffect(() => {
    // Solo cargar si tiene permisos
    if (hasPermission('users.view')) {
      fetchUsers();
    }
    fetchRoles();
    fetchCompanies();
    fetchBranches();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // =============================================
  // VALUE DEL CONTEXTO
  // =============================================

  const value: UsersContextType = {
    // Estado principal
    users,
    selectedUser,
    loading,
    error,
    
    // Paginación
    pagination,
    
    // Datos relacionados
    roles,
    companies,
    branches,
    
    // CRUD Usuarios
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    
    // Datos relacionados
    fetchRoles,
    fetchCompanies,
    fetchBranches,
    
    // Selección
    selectUser,
    clearSelectedUser,
    
    // Estadísticas
    getUserStatistics,
    
    // Auditoría
    getUserAuditLogs,
    
    // Gestión de contraseñas
    resetUserPassword,
    changeUserPassword,
    
    // Exportar/Importar
    exportUsers,
    importUsers,
    
    // Utilitarios
    searchUsers,
    getUsersByRole,
    getUsersByCompany,
    getActiveUsers,
    getInactiveUsers,
    getUserByEmail,
    getUserByDocument,
    
    // Limpiar error
    clearError,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

// =============================================
// HOOK PERSONALIZADO
// =============================================

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};