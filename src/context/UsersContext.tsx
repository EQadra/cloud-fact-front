// src/context/UsersContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  Role,
  PaginationParams,
  UserFilters,
} from '../types/index';
import { useAuth } from './AuthContext';
import { usePermissions } from '../hooks/usePermissions';

// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface UsersContextType {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  roles: Role[];
  fetchUsers: (params?: PaginationParams & UserFilters) => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  createUser: (data: CreateUserDto) => Promise<User>;
  updateUser: (id: string, data: UpdateUserDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<User>;
  fetchRoles: () => Promise<void>;
  selectUser: (user: User | null) => void;
  clearSelectedUser: () => void;
  getUserStatistics: () => Promise<any>;
  clearError: () => void;
}

// =============================================
// CONTEXTO
// =============================================

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

// =============================================
// PROVIDER
// =============================================

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const { canViewUsers, canViewRoles } = usePermissions();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const initialLoadDone = useRef(false);
  const isFetching = useRef(false);

  // =============================================
  // LIMPIAR ERROR
  // =============================================

  const clearError = useCallback(() => setError(null), []);

  // =============================================
  // SELECCIÓN
  // =============================================

  const selectUser = useCallback((user: User | null) => setSelectedUser(user), []);
  const clearSelectedUser = useCallback(() => setSelectedUser(null), []);

  // =============================================
  // FUNCIONES - ROLES
  // =============================================

  const fetchRoles = useCallback(async () => {
    if (!isAuthenticated || !token) {
      console.log('⏳ [fetchRoles] Usuario no autenticado, omitiendo...');
      return;
    }

    if (!canViewRoles()) {
      console.warn('🔒 [fetchRoles] No tienes permisos para ver roles');
      return;
    }

    try {
      const response = await api.get<Role[]>('/roles');
      setRoles(response.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.warn('🔒 [fetchRoles] No autorizado para ver roles');
      } else {
        console.error('Error fetching roles:', err);
      }
    }
  }, [isAuthenticated, token, canViewRoles]);

  // =============================================
  // FUNCIONES CRUD - USUARIOS (DEFINIDAS ANTES DE fetchUsers)
  // =============================================

  const fetchUserById = useCallback(async (id: string): Promise<User> => {
    if (!isAuthenticated || !token) {
      console.log('⏳ [fetchUserById] Usuario no autenticado, omitiendo...');
      throw new Error('No autenticado');
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
  }, [isAuthenticated, token]);

  const createUser = useCallback(async (data: CreateUserDto): Promise<User> => {
    if (!isAuthenticated || !token) {
      throw new Error('No autenticado');
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
  }, [isAuthenticated, token]);

  const updateUser = useCallback(async (id: string, data: UpdateUserDto): Promise<User> => {
    if (!isAuthenticated || !token) {
      throw new Error('No autenticado');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<User>(`/users/${id}`, data);
      const updatedUser = response.data;
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (selectedUser?.id === id) setSelectedUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el usuario';
      setError(errorMessage);
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser, isAuthenticated, token]);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    if (!isAuthenticated || !token) {
      throw new Error('No autenticado');
    }

    setLoading(true);
    setError(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el usuario';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser, isAuthenticated, token]);

  const toggleUserStatus = useCallback(async (id: string): Promise<User> => {
    if (!isAuthenticated || !token) {
      throw new Error('No autenticado');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<User>(`/users/${id}/toggle-status`);
      const updatedUser = response.data;
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (selectedUser?.id === id) setSelectedUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado del usuario';
      setError(errorMessage);
      console.error('Error toggling user status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedUser, isAuthenticated, token]);

  // =============================================
  // FETCH USERS (DEFINIDA DESPUÉS DE LAS OTRAS FUNCIONES)
  // =============================================

  const fetchUsers = useCallback(async (params?: PaginationParams & UserFilters) => {
    if (!isAuthenticated || !token) {
      console.log('⏳ [fetchUsers] Usuario no autenticado, omitiendo carga...');
      return;
    }

    if (!canViewUsers()) {
      console.warn('🔒 [fetchUsers] No tienes permisos para ver usuarios');
      return;
    }

    if (isFetching.current) {
      console.log('⏳ [fetchUsers] Ya hay una carga en progreso, omitiendo...');
      return;
    }

    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.roleId) queryParams.append('roleId', params.roleId);
      if (params?.estado !== undefined) queryParams.append('estado', String(params.estado));

      const response = await api.get(`/users?${queryParams.toString()}`);
      
      console.log('📦 Respuesta del servidor:', response.data);
      
      let usersData = [];
      let total = 0;
      let currentPage = params?.page || 1;
      let totalPages = 1;
      let limit = params?.limit || 10;

      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          usersData = response.data.data;
          if (response.data.meta) {
            total = response.data.meta.total || 0;
            currentPage = response.data.meta.page || 1;
            totalPages = response.data.meta.totalPages || 1;
            limit = response.data.meta.limit || 10;
          }
        } else if (Array.isArray(response.data)) {
          usersData = response.data;
          total = response.data.length;
          totalPages = 1;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          usersData = response.data.users;
          total = response.data.total || response.data.users.length;
          totalPages = 1;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          usersData = response.data.items;
          total = response.data.total || response.data.items.length;
          totalPages = 1;
        } else {
          usersData = Array.isArray(response.data) ? response.data : [];
        }
      }

      setUsers(usersData);
      setPagination({
        page: currentPage,
        limit: limit,
        total: total,
        totalPages: totalPages,
      });
      initialLoadDone.current = true;
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.warn('🔒 [fetchUsers] No autorizado para ver usuarios');
        setError(null);
      } else if (err.response?.status === 401) {
        console.log('🔒 [fetchUsers] No autenticado');
        setError(null);
      } else {
        const errorMessage = err.response?.data?.message || 'Error al cargar los usuarios';
        setError(errorMessage);
        console.error('Error fetching users:', err);
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [isAuthenticated, token, canViewUsers]);

  // =============================================
  // ESTADÍSTICAS
  // =============================================

  const getUserStatistics = useCallback(async (): Promise<any> => {
    try {
      const total = users.length;
      const active = users.filter(u => u.estado !== false).length;
      const inactive = users.filter(u => u.estado === false).length;
      
      const byRole: Record<string, number> = {};
      users.forEach(u => {
        const roleName = u.role?.nombre || 'Sin rol';
        byRole[roleName] = (byRole[roleName] || 0) + 1;
      });

      return {
        total,
        active,
        inactive,
        byRole,
      };
    } catch (err: any) {
      console.error('Error getting statistics:', err);
      return {
        total: users.length,
        active: users.filter(u => u.estado !== false).length,
        inactive: users.filter(u => u.estado === false).length,
        byRole: {},
      };
    }
  }, [users]);

  // =============================================
  // ✅ EFECTO - CARGA CONDICIONAL
  // =============================================

  useEffect(() => {
    console.log('🔄 [UsersProvider] useEffect - Verificando autenticación...');
    
    if (isAuthenticated && token && !initialLoadDone.current && !isFetching.current) {
      console.log('🔄 [UsersProvider] Usuario autenticado, cargando datos...');
      
      // ✅ Intentar cargar datos, pero no fallar si no hay permisos
      const loadData = async () => {
        try {
          await fetchUsers();
        } catch (err) {
          // Silencioso - el error ya se maneja en fetchUsers
        }
        
        try {
          await fetchRoles();
        } catch (err) {
          // Silencioso - el error ya se maneja en fetchRoles
        }
      };
      
      loadData();
    }

    if (!isAuthenticated && initialLoadDone.current) {
      console.log('🔄 [UsersProvider] Usuario desautenticado, limpiando datos...');
      setUsers([]);
      setRoles([]);
      setSelectedUser(null);
      initialLoadDone.current = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  // =============================================
  // VALUE DEL CONTEXTO
  // =============================================

  const value: UsersContextType = {
    users,
    selectedUser,
    loading,
    error,
    pagination,
    roles,
    fetchUsers,
    fetchUserById,    // ✅ AHORA ESTÁ DEFINIDA
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    fetchRoles,
    selectUser,
    clearSelectedUser,
    getUserStatistics,
    clearError,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};