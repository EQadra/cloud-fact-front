// src/hooks/usePermissions.ts
import { useAuth } from '../context/AuthContext';

// =============================================
// CONSTANTES DE PERMISOS - USANDO LOS DE TU BACKEND
// =============================================

export const PERMISSIONS = {
  // Usuarios
  VER_USUARIOS: 'VER_USUARIOS',
  GESTIONAR_USUARIOS: 'GESTIONAR_USUARIOS',
  
  // Roles
  VER_ROLES: 'VER_ROLES',
  GESTIONAR_ROLES: 'GESTIONAR_ROLES',
  ASIGNAR_PERMISOS: 'ASIGNAR_PERMISOS', // ✅ NUEVO
  
  // Permisos
  VER_PERMISOS: 'VER_PERMISOS',
  GESTIONAR_PERMISOS: 'GESTIONAR_PERMISOS',
  
  // Dashboard
  VER_DASHBOARD: 'VER_DASHBOARD',
  VER_REPORTES: 'VER_REPORTES',
  
  // Producción
  VER_PRODUCCION: 'VER_PRODUCCION',
  GESTIONAR_LOTES: 'GESTIONAR_LOTES',
  GESTIONAR_INFORMES: 'GESTIONAR_INFORMES',
  VER_INFORMES: 'VER_INFORMES',
  GESTIONAR_PATOLOGIAS: 'GESTIONAR_PATOLOGIAS',
  
  // Seguridad
  VER_ACCESO: 'VER_ACCESO',
  GESTIONAR_ACCESO: 'GESTIONAR_ACCESO',
  VER_INCIDENTES: 'VER_INCIDENTES',
  GESTIONAR_INCIDENTES: 'GESTIONAR_INCIDENTES',
  VER_CAMARAS: 'VER_CAMARAS',
  GESTIONAR_CAMARAS: 'GESTIONAR_CAMARAS',
  
  // Médico
  VER_PACIENTES: 'VER_PACIENTES',
  GESTIONAR_PACIENTES: 'GESTIONAR_PACIENTES',
  VER_HISTORIAL: 'VER_HISTORIAL',
  GESTIONAR_RECETAS: 'GESTIONAR_RECETAS',
  
  // Comercial
  VER_VENTAS: 'VER_VENTAS',
  CREAR_VENTAS: 'CREAR_VENTAS',
  ANULAR_VENTAS: 'ANULAR_VENTAS',
  VER_PRODUCTOS: 'VER_PRODUCTOS',
  GESTIONAR_PRODUCTOS: 'GESTIONAR_PRODUCTOS',
} as const;

// =============================================
// CONSTANTES DE ROLES
// =============================================

export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  SUPER_ADMIN: 'SuperAdministrador',
  GERENTE: 'Gerente',
  MEDICO: 'Médico',
  PRODUCCION: 'Producción',
  SEGURIDAD: 'Seguridad',
  VENDEDOR: 'Vendedor',
  OPERADOR: 'Operador',
  SUPERVISOR: 'Supervisor',
} as const;

// =============================================
// HOOK PRINCIPAL
// =============================================

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionName: string): boolean => {
    return user?.permissions?.includes(permissionName) || false;
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissionNames.some(p => user.permissions.includes(p));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissionNames.every(p => user.permissions.includes(p));
  };

  return {
    // ===== PERMISOS BASE =====
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissions: () => user?.permissions || [],
    getUserRole: () => user?.role?.nombre || null,
    getUser: () => user,

    // ===== USUARIOS =====
    canViewUsers: () => hasPermission(PERMISSIONS.VER_USUARIOS),
    canCreateUsers: () => hasPermission(PERMISSIONS.GESTIONAR_USUARIOS),
    canEditUsers: () => hasPermission(PERMISSIONS.GESTIONAR_USUARIOS),
    canDeleteUsers: () => hasPermission(PERMISSIONS.GESTIONAR_USUARIOS),
    canToggleUserStatus: () => hasPermission(PERMISSIONS.GESTIONAR_USUARIOS),

    // ===== ROLES =====
    canViewRoles: () => hasPermission(PERMISSIONS.VER_ROLES),
    canCreateRoles: () => hasPermission(PERMISSIONS.GESTIONAR_ROLES),
    canEditRoles: () => hasPermission(PERMISSIONS.GESTIONAR_ROLES),
    canDeleteRoles: () => hasPermission(PERMISSIONS.GESTIONAR_ROLES),
    canAssignPermissions: () => hasPermission(PERMISSIONS.ASIGNAR_PERMISOS) || hasPermission(PERMISSIONS.GESTIONAR_ROLES), // ✅ NUEVO

    // ===== PERMISOS =====
    canViewPermissions: () => hasPermission(PERMISSIONS.VER_PERMISOS),
    canCreatePermissions: () => hasPermission(PERMISSIONS.GESTIONAR_PERMISOS),
    canEditPermissions: () => hasPermission(PERMISSIONS.GESTIONAR_PERMISOS),
    canDeletePermissions: () => hasPermission(PERMISSIONS.GESTIONAR_PERMISOS),

    // ===== DASHBOARD =====
    canViewDashboard: () => hasPermission(PERMISSIONS.VER_DASHBOARD),
    canViewReports: () => hasPermission(PERMISSIONS.VER_REPORTES),

    // ===== PRODUCCIÓN =====
    canViewProduction: () => hasPermission(PERMISSIONS.VER_PRODUCCION),
    canManageLots: () => hasPermission(PERMISSIONS.GESTIONAR_LOTES),
    canManageReports: () => hasPermission(PERMISSIONS.GESTIONAR_INFORMES),
    canViewProductionReports: () => hasPermission(PERMISSIONS.VER_INFORMES),
    canManagePathologies: () => hasPermission(PERMISSIONS.GESTIONAR_PATOLOGIAS),

    // ===== SEGURIDAD =====
    canViewSecurity: () => hasPermission(PERMISSIONS.VER_ACCESO),
    canManageAccess: () => hasPermission(PERMISSIONS.GESTIONAR_ACCESO),
    canViewIncidents: () => hasPermission(PERMISSIONS.VER_INCIDENTES),
    canManageIncidents: () => hasPermission(PERMISSIONS.GESTIONAR_INCIDENTES),
    canViewCameras: () => hasPermission(PERMISSIONS.VER_CAMARAS),
    canManageCameras: () => hasPermission(PERMISSIONS.GESTIONAR_CAMARAS),

    // ===== MÉDICO =====
    canViewPatients: () => hasPermission(PERMISSIONS.VER_PACIENTES),
    canManagePatients: () => hasPermission(PERMISSIONS.GESTIONAR_PACIENTES),
    canViewMedicalHistory: () => hasPermission(PERMISSIONS.VER_HISTORIAL),
    canManagePrescriptions: () => hasPermission(PERMISSIONS.GESTIONAR_RECETAS),

    // ===== COMERCIAL =====
    canViewSales: () => hasPermission(PERMISSIONS.VER_VENTAS),
    canCreateSales: () => hasPermission(PERMISSIONS.CREAR_VENTAS),
    canCancelSales: () => hasPermission(PERMISSIONS.ANULAR_VENTAS),
    canViewProducts: () => hasPermission(PERMISSIONS.VER_PRODUCTOS),
    canManageProducts: () => hasPermission(PERMISSIONS.GESTIONAR_PRODUCTOS),

    // ===== VERIFICACIONES DE ROLES =====
    isAdmin: () => user?.role?.nombre === ROLES.ADMINISTRADOR,
    isSuperAdmin: () => user?.role?.nombre === ROLES.SUPER_ADMIN || user?.role?.nombre === ROLES.ADMINISTRADOR,
    isGerente: () => user?.role?.nombre === ROLES.GERENTE,
    isMedico: () => user?.role?.nombre === ROLES.MEDICO,
    isProduccion: () => user?.role?.nombre === ROLES.PRODUCCION,
    isSeguridad: () => user?.role?.nombre === ROLES.SEGURIDAD,
    isVendedor: () => user?.role?.nombre === ROLES.VENDEDOR,
    isOperador: () => user?.role?.nombre === ROLES.OPERADOR,
    isSupervisor: () => user?.role?.nombre === ROLES.SUPERVISOR,
  };
};