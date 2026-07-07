// src/hooks/usePermissions.ts
import { useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

// =============================================
// CONSTANTES DE PERMISOS (para evitar typos)
// =============================================

export const PERMISSIONS = {
  // Usuarios
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_TOGGLE_STATUS: 'users.toggle-status',
  
  // Roles
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  
  // Permisos
  PERMISSIONS_VIEW: 'permissions.view',
  PERMISSIONS_ASSIGN: 'permissions.assign',
  
  // Producción
  PRODUCTION_VIEW: 'production.view',
  PRODUCTION_CREATE: 'production.create',
  PRODUCTION_EDIT: 'production.edit',
  PRODUCTION_DELETE: 'production.delete',
  LOTS_MANAGE: 'lots.manage',
  LOTS_VIEW: 'lots.view',
  LOTS_TRACKING: 'lots.tracking',
  
  // Seguridad
  SECURITY_VIEW: 'security.view',
  CAMERAS_VIEW: 'cameras.view',
  CAMERAS_MANAGE: 'cameras.manage',
  ACCESS_VIEW: 'access.view',
  ACCESS_MANAGE: 'access.manage',
  INCIDENTS_VIEW: 'incidents.view',
  INCIDENTS_MANAGE: 'incidents.manage',
  
  // Médico
  PATIENTS_VIEW: 'patients.view',
  PATIENTS_MANAGE: 'patients.manage',
  MEDICAL_HISTORY_VIEW: 'medical-history.view',
  PRESCRIPTIONS_MANAGE: 'prescriptions.manage',
  PRESCRIPTIONS_VIEW: 'prescriptions.view',
  PATHOLOGIES_VIEW: 'pathologies.view',
  PATHOLOGIES_MANAGE: 'pathologies.manage',
  
  // Comercial
  SALES_VIEW: 'sales.view',
  SALES_CREATE: 'sales.create',
  SALES_EDIT: 'sales.edit',
  SALES_CANCEL: 'sales.cancel',
  SALES_ANUL: 'sales.anul',
  PURCHASES_VIEW: 'purchases.view',
  PURCHASES_CREATE: 'purchases.create',
  PURCHASES_EDIT: 'purchases.edit',
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_MANAGE: 'products.manage',
  KARDEX_VIEW: 'kardex.view',
  KARDEX_MANAGE: 'kardex.manage',
  
  // Empresa
  COMPANY_VIEW: 'company.view',
  COMPANY_MANAGE: 'company.manage',
  BRANCH_VIEW: 'branch.view',
  BRANCH_MANAGE: 'branch.manage',
  
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  STATISTICS_VIEW: 'statistics.view',
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  
  // Auditoría
  AUDIT_VIEW: 'audit.view',
} as const;

// =============================================
// CONSTANTES DE ROLES
// =============================================

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  MEDICO: 'MEDICO',
  PRODUCCION: 'PRODUCCION',
  SEGURIDAD: 'SEGURIDAD',
  VENDEDOR: 'VENDEDOR',
  OPERADOR: 'OPERADOR',
  SUPERVISOR: 'SUPERVISOR',
} as const;

// =============================================
// HOOK PRINCIPAL
// =============================================

export const usePermissions = () => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    hasRole, 
    hasAnyRole, 
    getPermissions,
    user,
  } = useAuth();

  // =============================================
  // FUNCIONES DE VERIFICACIÓN POR MÓDULO
  // =============================================

  // ----- USUARIOS -----
  const canManageUsers = useCallback(() => 
    hasAnyPermission([PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_EDIT, PERMISSIONS.USERS_DELETE]), 
    [hasAnyPermission]
  );
  
  const canViewUsers = useCallback(() => 
    hasPermission(PERMISSIONS.USERS_VIEW), 
    [hasPermission]
  );
  
  const canCreateUsers = useCallback(() => 
    hasPermission(PERMISSIONS.USERS_CREATE), 
    [hasPermission]
  );
  
  const canEditUsers = useCallback(() => 
    hasPermission(PERMISSIONS.USERS_EDIT), 
    [hasPermission]
  );
  
  const canDeleteUsers = useCallback(() => 
    hasPermission(PERMISSIONS.USERS_DELETE), 
    [hasPermission]
  );
  
  const canToggleUserStatus = useCallback(() => 
    hasPermission(PERMISSIONS.USERS_TOGGLE_STATUS), 
    [hasPermission]
  );

  // ----- ROLES -----
  const canManageRoles = useCallback(() => 
    hasAnyPermission([PERMISSIONS.ROLES_CREATE, PERMISSIONS.ROLES_EDIT, PERMISSIONS.ROLES_DELETE]), 
    [hasAnyPermission]
  );
  
  const canViewRoles = useCallback(() => 
    hasPermission(PERMISSIONS.ROLES_VIEW), 
    [hasPermission]
  );
  
  const canCreateRoles = useCallback(() => 
    hasPermission(PERMISSIONS.ROLES_CREATE), 
    [hasPermission]
  );
  
  const canEditRoles = useCallback(() => 
    hasPermission(PERMISSIONS.ROLES_EDIT), 
    [hasPermission]
  );
  
  const canDeleteRoles = useCallback(() => 
    hasPermission(PERMISSIONS.ROLES_DELETE), 
    [hasPermission]
  );

  // ----- PERMISOS -----
  const canViewPermissions = useCallback(() => 
    hasPermission(PERMISSIONS.PERMISSIONS_VIEW), 
    [hasPermission]
  );
  
  const canAssignPermissions = useCallback(() => 
    hasPermission(PERMISSIONS.PERMISSIONS_ASSIGN), 
    [hasPermission]
  );

  // ----- PRODUCCIÓN -----
  const canViewProduction = useCallback(() => 
    hasPermission(PERMISSIONS.PRODUCTION_VIEW), 
    [hasPermission]
  );
  
  const canManageProduction = useCallback(() => 
    hasAnyPermission([PERMISSIONS.PRODUCTION_CREATE, PERMISSIONS.PRODUCTION_EDIT, PERMISSIONS.PRODUCTION_DELETE]), 
    [hasAnyPermission]
  );
  
  const canManageLots = useCallback(() => 
    hasPermission(PERMISSIONS.LOTS_MANAGE), 
    [hasPermission]
  );
  
  const canViewLots = useCallback(() => 
    hasPermission(PERMISSIONS.LOTS_VIEW), 
    [hasPermission]
  );
  
  const canTrackLots = useCallback(() => 
    hasPermission(PERMISSIONS.LOTS_TRACKING), 
    [hasPermission]
  );

  // ----- SEGURIDAD -----
  const canViewSecurity = useCallback(() => 
    hasPermission(PERMISSIONS.SECURITY_VIEW), 
    [hasPermission]
  );
  
  const canViewCameras = useCallback(() => 
    hasPermission(PERMISSIONS.CAMERAS_VIEW), 
    [hasPermission]
  );
  
  const canManageCameras = useCallback(() => 
    hasPermission(PERMISSIONS.CAMERAS_MANAGE), 
    [hasPermission]
  );
  
  const canViewAccess = useCallback(() => 
    hasPermission(PERMISSIONS.ACCESS_VIEW), 
    [hasPermission]
  );
  
  const canManageAccess = useCallback(() => 
    hasPermission(PERMISSIONS.ACCESS_MANAGE), 
    [hasPermission]
  );
  
  const canViewIncidents = useCallback(() => 
    hasPermission(PERMISSIONS.INCIDENTS_VIEW), 
    [hasPermission]
  );
  
  const canManageIncidents = useCallback(() => 
    hasPermission(PERMISSIONS.INCIDENTS_MANAGE), 
    [hasPermission]
  );

  // ----- MÉDICO -----
  const canViewPatients = useCallback(() => 
    hasPermission(PERMISSIONS.PATIENTS_VIEW), 
    [hasPermission]
  );
  
  const canManagePatients = useCallback(() => 
    hasPermission(PERMISSIONS.PATIENTS_MANAGE), 
    [hasPermission]
  );
  
  const canViewMedicalHistory = useCallback(() => 
    hasPermission(PERMISSIONS.MEDICAL_HISTORY_VIEW), 
    [hasPermission]
  );
  
  const canManagePrescriptions = useCallback(() => 
    hasPermission(PERMISSIONS.PRESCRIPTIONS_MANAGE), 
    [hasPermission]
  );
  
  const canViewPrescriptions = useCallback(() => 
    hasPermission(PERMISSIONS.PRESCRIPTIONS_VIEW), 
    [hasPermission]
  );
  
  const canViewPathologies = useCallback(() => 
    hasPermission(PERMISSIONS.PATHOLOGIES_VIEW), 
    [hasPermission]
  );
  
  const canManagePathologies = useCallback(() => 
    hasPermission(PERMISSIONS.PATHOLOGIES_MANAGE), 
    [hasPermission]
  );

  // ----- COMERCIAL -----
  const canViewSales = useCallback(() => 
    hasPermission(PERMISSIONS.SALES_VIEW), 
    [hasPermission]
  );
  
  const canCreateSales = useCallback(() => 
    hasPermission(PERMISSIONS.SALES_CREATE), 
    [hasPermission]
  );
  
  const canEditSales = useCallback(() => 
    hasPermission(PERMISSIONS.SALES_EDIT), 
    [hasPermission]
  );
  
  const canCancelSales = useCallback(() => 
    hasPermission(PERMISSIONS.SALES_CANCEL), 
    [hasPermission]
  );
  
  const canAnulSales = useCallback(() => 
    hasPermission(PERMISSIONS.SALES_ANUL), 
    [hasPermission]
  );
  
  const canViewPurchases = useCallback(() => 
    hasPermission(PERMISSIONS.PURCHASES_VIEW), 
    [hasPermission]
  );
  
  const canCreatePurchases = useCallback(() => 
    hasPermission(PERMISSIONS.PURCHASES_CREATE), 
    [hasPermission]
  );
  
  const canEditPurchases = useCallback(() => 
    hasPermission(PERMISSIONS.PURCHASES_EDIT), 
    [hasPermission]
  );
  
  const canViewProducts = useCallback(() => 
    hasPermission(PERMISSIONS.PRODUCTS_VIEW), 
    [hasPermission]
  );
  
  const canManageProducts = useCallback(() => 
    hasPermission(PERMISSIONS.PRODUCTS_MANAGE), 
    [hasPermission]
  );
  
  const canViewKardex = useCallback(() => 
    hasPermission(PERMISSIONS.KARDEX_VIEW), 
    [hasPermission]
  );
  
  const canManageKardex = useCallback(() => 
    hasPermission(PERMISSIONS.KARDEX_MANAGE), 
    [hasPermission]
  );

  // ----- EMPRESA -----
  const canViewCompany = useCallback(() => 
    hasPermission(PERMISSIONS.COMPANY_VIEW), 
    [hasPermission]
  );
  
  const canManageCompany = useCallback(() => 
    hasPermission(PERMISSIONS.COMPANY_MANAGE), 
    [hasPermission]
  );
  
  const canViewBranches = useCallback(() => 
    hasPermission(PERMISSIONS.BRANCH_VIEW), 
    [hasPermission]
  );
  
  const canManageBranches = useCallback(() => 
    hasPermission(PERMISSIONS.BRANCH_MANAGE), 
    [hasPermission]
  );

  // ----- DASHBOARD -----
  const canViewDashboard = useCallback(() => 
    hasPermission(PERMISSIONS.DASHBOARD_VIEW), 
    [hasPermission]
  );
  
  const canViewStatistics = useCallback(() => 
    hasPermission(PERMISSIONS.STATISTICS_VIEW), 
    [hasPermission]
  );
  
  const canViewReports = useCallback(() => 
    hasPermission(PERMISSIONS.REPORTS_VIEW), 
    [hasPermission]
  );
  
  const canExportReports = useCallback(() => 
    hasPermission(PERMISSIONS.REPORTS_EXPORT), 
    [hasPermission]
  );

  // ----- AUDITORÍA -----
  const canViewAudit = useCallback(() => 
    hasPermission(PERMISSIONS.AUDIT_VIEW), 
    [hasPermission]
  );

  // =============================================
  // VERIFICACIONES DE ROLES
  // =============================================

  const isSuperAdmin = useCallback(() => 
    hasRole(ROLES.SUPER_ADMIN), 
    [hasRole]
  );
  
  const isAdmin = useCallback(() => 
    hasRole(ROLES.ADMIN), 
    [hasRole]
  );
  
  const isGerente = useCallback(() => 
    hasRole(ROLES.GERENTE), 
    [hasRole]
  );
  
  const isMedico = useCallback(() => 
    hasRole(ROLES.MEDICO), 
    [hasRole]
  );
  
  const isProduccion = useCallback(() => 
    hasRole(ROLES.PRODUCCION), 
    [hasRole]
  );
  
  const isSeguridad = useCallback(() => 
    hasRole(ROLES.SEGURIDAD), 
    [hasRole]
  );
  
  const isVendedor = useCallback(() => 
    hasRole(ROLES.VENDEDOR), 
    [hasRole]
  );
  
  const isOperador = useCallback(() => 
    hasRole(ROLES.OPERADOR), 
    [hasRole]
  );
  
  const isSupervisor = useCallback(() => 
    hasRole(ROLES.SUPERVISOR), 
    [hasRole]
  );

  // =============================================
  // FUNCIONES AVANZADAS
  // =============================================

  // Verificar si tiene acceso completo a un módulo (todos los permisos)
  const hasFullModuleAccess = useCallback((modulePermissions: string[]): boolean => {
    return hasAllPermissions(modulePermissions);
  }, [hasAllPermissions]);

  // Verificar si tiene acceso mínimo a un módulo (al menos un permiso)
  const hasAnyModuleAccess = useCallback((modulePermissions: string[]): boolean => {
    return hasAnyPermission(modulePermissions);
  }, [hasAnyPermission]);

  // Obtener permisos del usuario actual
  const userPermissions = useMemo(() => {
    return getPermissions();
  }, [getPermissions]);

  // Verificar si el usuario tiene permisos para un módulo específico
  const hasModuleAccess = useCallback((module: 'users' | 'roles' | 'production' | 'security' | 'medical' | 'commercial'): boolean => {
    const modulePermissions: Record<string, string[]> = {
      users: [
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.USERS_EDIT,
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.USERS_TOGGLE_STATUS,
      ],
      roles: [
        PERMISSIONS.ROLES_VIEW,
        PERMISSIONS.ROLES_CREATE,
        PERMISSIONS.ROLES_EDIT,
        PERMISSIONS.ROLES_DELETE,
      ],
      production: [
        PERMISSIONS.PRODUCTION_VIEW,
        PERMISSIONS.PRODUCTION_CREATE,
        PERMISSIONS.PRODUCTION_EDIT,
        PERMISSIONS.PRODUCTION_DELETE,
        PERMISSIONS.LOTS_VIEW,
        PERMISSIONS.LOTS_MANAGE,
      ],
      security: [
        PERMISSIONS.SECURITY_VIEW,
        PERMISSIONS.CAMERAS_VIEW,
        PERMISSIONS.CAMERAS_MANAGE,
        PERMISSIONS.ACCESS_VIEW,
        PERMISSIONS.ACCESS_MANAGE,
        PERMISSIONS.INCIDENTS_VIEW,
        PERMISSIONS.INCIDENTS_MANAGE,
      ],
      medical: [
        PERMISSIONS.PATIENTS_VIEW,
        PERMISSIONS.PATIENTS_MANAGE,
        PERMISSIONS.MEDICAL_HISTORY_VIEW,
        PERMISSIONS.PRESCRIPTIONS_VIEW,
        PERMISSIONS.PRESCRIPTIONS_MANAGE,
      ],
      commercial: [
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
        PERMISSIONS.SALES_EDIT,
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.PRODUCTS_MANAGE,
        PERMISSIONS.KARDEX_VIEW,
      ],
    };

    const permissions = modulePermissions[module] || [];
    return hasAnyPermission(permissions);
  }, [hasAnyPermission]);

  // =============================================
  // RETURN
  // =============================================

  return {
    // Permisos base
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getPermissions,
    userPermissions,
    
    // Permisos de usuarios
    canManageUsers,
    canViewUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canToggleUserStatus,
    
    // Permisos de roles
    canManageRoles,
    canViewRoles,
    canCreateRoles,
    canEditRoles,
    canDeleteRoles,
    
    // Permisos de permisos
    canViewPermissions,
    canAssignPermissions,
    
    // Permisos de producción
    canViewProduction,
    canManageProduction,
    canManageLots,
    canViewLots,
    canTrackLots,
    
    // Permisos de seguridad
    canViewSecurity,
    canViewCameras,
    canManageCameras,
    canViewAccess,
    canManageAccess,
    canViewIncidents,
    canManageIncidents,
    
    // Permisos médicos
    canViewPatients,
    canManagePatients,
    canViewMedicalHistory,
    canManagePrescriptions,
    canViewPrescriptions,
    canViewPathologies,
    canManagePathologies,
    
    // Permisos comerciales
    canViewSales,
    canCreateSales,
    canEditSales,
    canCancelSales,
    canAnulSales,
    canViewPurchases,
    canCreatePurchases,
    canEditPurchases,
    canViewProducts,
    canManageProducts,
    canViewKardex,
    canManageKardex,
    
    // Permisos de empresa
    canViewCompany,
    canManageCompany,
    canViewBranches,
    canManageBranches,
    
    // Permisos de dashboard
    canViewDashboard,
    canViewStatistics,
    canViewReports,
    canExportReports,
    
    // Permisos de auditoría
    canViewAudit,
    
    // Verificaciones de roles
    isSuperAdmin,
    isAdmin,
    isGerente,
    isMedico,
    isProduccion,
    isSeguridad,
    isVendedor,
    isOperador,
    isSupervisor,
    
    // Funciones avanzadas
    hasFullModuleAccess,
    hasAnyModuleAccess,
    hasModuleAccess,
  };
};

// =============================================
// HOOK DE PERMISOS PARA COMPONENTES
// =============================================

/**
 * Hook para verificar permisos en componentes de forma declarativa
 * 
 * @example
 * const { can } = usePermissionsCheck({
 *   view: ['users.view', 'roles.view'],
 *   edit: ['users.edit'],
 * });
 * 
 * if (can.view) { ... }
 */
export const usePermissionsCheck = (permissions: {
  view?: string[];
  create?: string[];
  edit?: string[];
  delete?: string[];
  manage?: string[];
}) => {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  return {
    can: {
      view: permissions.view ? hasAllPermissions(permissions.view) : false,
      create: permissions.create ? hasAnyPermission(permissions.create) : false,
      edit: permissions.edit ? hasAnyPermission(permissions.edit) : false,
      delete: permissions.delete ? hasAnyPermission(permissions.delete) : false,
      manage: permissions.manage ? hasAnyPermission(permissions.manage) : false,
    },
    hasAny: (permList: string[]) => hasAnyPermission(permList),
    hasAll: (permList: string[]) => hasAllPermissions(permList),
  };
};

// =============================================
// HOOK PARA VERIFICAR ROLES
// =============================================

/**
 * Hook para verificar roles en componentes
 * 
 * @example
 * const { isAdmin, isMedico } = useRolesCheck();
 */
export const useRolesCheck = () => {
  const { hasRole, hasAnyRole, user } = useAuth();

  return {
    hasRole,
    hasAnyRole,
    isSuperAdmin: hasRole(ROLES.SUPER_ADMIN),
    isAdmin: hasRole(ROLES.ADMIN),
    isGerente: hasRole(ROLES.GERENTE),
    isMedico: hasRole(ROLES.MEDICO),
    isProduccion: hasRole(ROLES.PRODUCCION),
    isSeguridad: hasRole(ROLES.SEGURIDAD),
    isVendedor: hasRole(ROLES.VENDEDOR),
    isOperador: hasRole(ROLES.OPERADOR),
    isSupervisor: hasRole(ROLES.SUPERVISOR),
    userRole: user?.role?.nombre,
  };
};