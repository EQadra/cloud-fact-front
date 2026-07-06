// src/hooks/usePermissions.ts
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole, getPermissions } = useAuth();

  // Verificar permisos para módulos específicos
  const canManageUsers = useCallback(() => hasPermission('GESTIONAR_USUARIOS'), [hasPermission]);
  const canViewUsers = useCallback(() => hasPermission('VER_USUARIOS'), [hasPermission]);
  const canManageRoles = useCallback(() => hasPermission('GESTIONAR_ROLES'), [hasPermission]);
  const canViewRoles = useCallback(() => hasPermission('VER_ROLES'), [hasPermission]);
  
  // Producción
  const canViewProduction = useCallback(() => hasPermission('VER_PRODUCCION'), [hasPermission]);
  const canManageLots = useCallback(() => hasPermission('GESTIONAR_LOTES'), [hasPermission]);
  
  // Seguridad
  const canViewCameras = useCallback(() => hasPermission('VER_CAMARAS'), [hasPermission]);
  const canManageCameras = useCallback(() => hasPermission('GESTIONAR_CAMARAS'), [hasPermission]);
  const canViewAccess = useCallback(() => hasPermission('VER_ACCESO'), [hasPermission]);
  const canManageAccess = useCallback(() => hasPermission('GESTIONAR_ACCESO'), [hasPermission]);
  
  // Médico
  const canViewPatients = useCallback(() => hasPermission('VER_PACIENTES'), [hasPermission]);
  const canManagePatients = useCallback(() => hasPermission('GESTIONAR_PACIENTES'), [hasPermission]);
  const canViewHistory = useCallback(() => hasPermission('VER_HISTORIAL'), [hasPermission]);
  const canManagePrescriptions = useCallback(() => hasPermission('GESTIONAR_RECETAS'), [hasPermission]);
  
  // Comercial
  const canViewSales = useCallback(() => hasPermission('VER_VENTAS'), [hasPermission]);
  const canCreateSales = useCallback(() => hasPermission('CREAR_VENTAS'), [hasPermission]);
  const canCancelSales = useCallback(() => hasPermission('ANULAR_VENTAS'), [hasPermission]);
  const canManageProducts = useCallback(() => hasPermission('GESTIONAR_PRODUCTOS'), [hasPermission]);
  const canViewProducts = useCallback(() => hasPermission('VER_PRODUCTOS'), [hasPermission]);

  // Roles predefinidos
  const isSuperAdmin = useCallback(() => hasRole('SUPER_ADMIN'), [hasRole]);
  const isAdmin = useCallback(() => hasRole('ADMIN'), [hasRole]);
  const isGerente = useCallback(() => hasRole('GERENTE'), [hasRole]);
  const isMedico = useCallback(() => hasRole('MEDICO'), [hasRole]);
  const isProduccion = useCallback(() => hasRole('PRODUCCION'), [hasRole]);
  const isSeguridad = useCallback(() => hasRole('SEGURIDAD'), [hasRole]);
  const isVendedor = useCallback(() => hasRole('VENDEDOR'), [hasRole]);

  return {
    // Permisos base
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getPermissions,
    
    // Permisos específicos por módulo
    canManageUsers,
    canViewUsers,
    canManageRoles,
    canViewRoles,
    canViewProduction,
    canManageLots,
    canViewCameras,
    canManageCameras,
    canViewAccess,
    canManageAccess,
    canViewPatients,
    canManagePatients,
    canViewHistory,
    canManagePrescriptions,
    canViewSales,
    canCreateSales,
    canCancelSales,
    canManageProducts,
    canViewProducts,
    
    // Roles
    isSuperAdmin,
    isAdmin,
    isGerente,
    isMedico,
    isProduccion,
    isSeguridad,
    isVendedor,
  };
};