// src/views/auth/PermissionsByRole.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSave, FaSpinner, FaUserShield, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRoles } from '../../context/RolesContext';
import { usePermissionsContext } from '../../context/PermissionsContext';
import { usePermissions } from '../../hooks/usePermissions';

export default function PermissionsByRole() {
  // ===== HOOKS =====
  const {
    roles,
    loading: rolesLoading,
    fetchRoles,
    rolePermissions,
    fetchRolePermissions,
    assignPermissionsToRole,
    removePermissionFromRole,
    selectedRole,
    selectRole,
    error: rolesError,
    clearError: clearRolesError,
  } = useRoles();

  // ✅ CORREGIDO: Desestructurar error y clearError del contexto de permisos
  const {
    permissions,
    loading: permissionsLoading,
    fetchPermissions,
    groupPermissionsByModule,
    error: permissionsError,        // ✅ Ahora sí está definido
    clearError: clearPermissionsError, // ✅ Ahora sí está definido
  } = usePermissionsContext();

  const { canEditRoles } = usePermissions();

  // ===== ESTADOS LOCALES =====
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [localPermissions, setLocalPermissions] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const initialLoadDone = useRef(false);

  // ===== PERMISOS =====
  const canEdit = canEditRoles();

  // =============================================
  // CARGA INICIAL
  // =============================================
  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        fetchRoles({ limit: 100 }),
        fetchPermissions(),
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, [fetchRoles, fetchPermissions]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadData();
    }
  }, [loadData]);

  // =============================================
  // CARGAR PERMISOS DEL ROL SELECCIONADO
  // =============================================
  useEffect(() => {
    if (selectedRoleId) {
      const loadPermissions = async () => {
        try {
          const perms = await fetchRolePermissions(selectedRoleId);
          const permIds = perms.map(p => p.permissionId);
          setLocalPermissions(prev => ({
            ...prev,
            [selectedRoleId]: permIds,
          }));
        } catch (err) {
          console.error('Error loading role permissions:', err);
        }
      };
      loadPermissions();
    }
  }, [selectedRoleId, fetchRolePermissions]);

  // =============================================
  // SELECCIONAR ROL
  // =============================================
  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    selectRole(roles.find(r => r.id === roleId) || null);
    setSaveSuccess(false);
    setSaveError(null);
  };

  // =============================================
  // TOGGLE PERMISO
  // =============================================
  const togglePermission = (permissionId: string) => {
    if (!selectedRoleId || !canEdit) return;

    const current = localPermissions[selectedRoleId] || [];
    const exists = current.includes(permissionId);

    setLocalPermissions({
      ...localPermissions,
      [selectedRoleId]: exists
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId],
    });

    setSaveSuccess(false);
    setSaveError(null);
  };

  // =============================================
  // GUARDAR PERMISOS
  // =============================================
  const handleSave = async () => {
    if (!selectedRoleId || !canEdit) return;

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const currentPerms = localPermissions[selectedRoleId] || [];
      const backendPerms = rolePermissions.map(p => p.permissionId);

      const toAdd = currentPerms.filter(id => !backendPerms.includes(id));
      const toRemove = backendPerms.filter(id => !currentPerms.includes(id));

      if (toAdd.length > 0) {
        await assignPermissionsToRole(selectedRoleId, toAdd);
      }

      for (const permId of toRemove) {
        await removePermissionFromRole(selectedRoleId, permId);
      }

      await fetchRolePermissions(selectedRoleId);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving permissions:', err);
      setSaveError(err.response?.data?.message || 'Error al guardar los permisos');
    } finally {
      setSaving(false);
    }
  };

  // =============================================
  // VERIFICAR SI UN PERMISO ESTÁ SELECCIONADO
  // =============================================
  const isPermissionSelected = (permissionId: string): boolean => {
    if (!selectedRoleId) return false;
    return (localPermissions[selectedRoleId] || []).includes(permissionId);
  };

  // =============================================
  // AGRUPAR PERMISOS POR MÓDULO
  // =============================================
  const groupedPermissions = groupPermissionsByModule();

  // =============================================
  // OBTENER NOMBRE DEL ROL SELECCIONADO
  // =============================================
  const selectedRoleName = roles.find(r => r.id === selectedRoleId)?.nombre || 'Selecciona un rol';

  // =============================================
  // RENDER
  // =============================================

  if (!canEdit) {
    return (
      <div style={styles.container}>
        <div style={styles.unauthorized}>
          <FaUserShield size={60} color="#ef4444" />
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para gestionar permisos</p>
        </div>
      </div>
    );
  }

  const isLoading = rolesLoading || permissionsLoading;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <FaUserShield style={{ color: '#3b82f6', marginRight: '12px' }} />
            Permisos por Rol
          </h1>
          <p style={styles.subtitle}>
            Gestiona los permisos y accesos de cada rol en el sistema
          </p>
        </div>

        <button
          style={{
            ...styles.saveButton,
            opacity: saving || !selectedRoleId ? 0.7 : 1,
            cursor: saving || !selectedRoleId ? 'not-allowed' : 'pointer',
          }}
          onClick={handleSave}
          disabled={saving || !selectedRoleId}
        >
          {saving ? (
            <>
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              Guardando...
            </>
          ) : (
            <>
              <FaSave />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      {/* Mensajes de estado */}
      {saveSuccess && (
        <div style={styles.successBanner}>
          <FaCheckCircle style={{ marginRight: '10px' }} />
          ¡Permisos guardados exitosamente!
        </div>
      )}

      {saveError && (
        <div style={styles.errorBanner}>
          <FaTimesCircle style={{ marginRight: '10px' }} />
          {saveError}
          <button style={styles.errorClose} onClick={() => setSaveError(null)}>
            ×
          </button>
        </div>
      )}

      {/* ✅ Error del contexto de roles */}
      {rolesError && (
        <div style={styles.errorBanner}>
          <span>{rolesError}</span>
          <button style={styles.errorClose} onClick={clearRolesError}>
            ×
          </button>
        </div>
      )}

      {/* ✅ Error del contexto de permisos (CORREGIDO) */}
      {permissionsError && (
        <div style={styles.errorBanner}>
          <span>{permissionsError}</span>
          <button style={styles.errorClose} onClick={clearPermissionsError}>
            ×
          </button>
        </div>
      )}

      {/* Content */}
      <div style={styles.content}>
        {/* Panel de Roles */}
        <div style={styles.rolesPanel}>
          <h3 style={styles.sectionTitle}>Roles</h3>

          {isLoading ? (
            <div style={styles.loading}>
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              <p>Cargando roles...</p>
            </div>
          ) : (
            roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                style={{
                  ...styles.roleButton,
                  background: selectedRoleId === role.id ? '#2563eb' : 'rgba(255,255,255,.05)',
                  border: selectedRoleId === role.id ? '1px solid #3b82f6' : '1px solid transparent',
                }}
              >
                <div style={styles.roleButtonContent}>
                  <span>{role.nombre}</span>
                  <span style={styles.roleCount}>
                    {role._count?.users || 0} usuarios
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Panel de Permisos */}
        <div style={styles.permissionsPanel}>
          {!selectedRoleId ? (
            <div style={styles.emptyState}>
              <FaUserShield size={48} color="#475569" />
              <h3>Selecciona un rol</h3>
              <p style={{ color: '#94a3b8' }}>
                Elige un rol del panel izquierdo para gestionar sus permisos
              </p>
            </div>
          ) : isLoading ? (
            <div style={styles.loading}>
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              <p>Cargando permisos...</p>
            </div>
          ) : (
            <>
              <div style={styles.permissionsHeader}>
                <h3 style={styles.sectionTitle}>
                  Permisos de <span style={{ color: '#60a5fa' }}>{selectedRoleName}</span>
                </h3>
                <span style={styles.permissionsCount}>
                  {Object.keys(groupedPermissions).length} módulos • 
                  {Object.values(groupedPermissions).reduce((acc, perms) => acc + perms.length, 0)} permisos
                </span>
              </div>

              {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} style={styles.moduleCard}>
                  <h4 style={styles.moduleTitle}>{module}</h4>
                  <div style={styles.permissionsGrid}>
                    {modulePermissions.map((permission) => (
                      <label
                        key={permission.id}
                        style={{
                          ...styles.permissionItem,
                          background: isPermissionSelected(permission.id)
                            ? 'rgba(59,130,246,0.1)'
                            : 'transparent',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isPermissionSelected(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          disabled={!canEdit}
                        />
                        <span style={styles.permissionName}>{permission.nombre}</span>
                        {isPermissionSelected(permission.id) && (
                          <FaCheckCircle size={12} color="#22c55e" style={{ marginLeft: 'auto' }} />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Estilos de animación */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

// =============================================
// ESTILOS
// =============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '30px',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },

  unauthorized: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    gap: '16px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },

  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },

  subtitle: {
    color: '#94a3b8',
    marginTop: '8px',
    fontSize: '15px',
  },

  saveButton: {
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
    transition: 'all 0.2s',
  },

  successBanner: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    marginBottom: '20px',
    borderRadius: '12px',
    background: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.3)',
    color: '#22c55e',
  },

  errorBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    marginBottom: '20px',
    borderRadius: '12px',
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#ef4444',
  },

  errorClose: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 8px',
  },

  content: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '20px',
  },

  rolesPanel: {
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: '20px',
    padding: '20px',
    height: 'fit-content',
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
  },

  permissionsPanel: {
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: '20px',
    padding: '20px',
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
  },

  roleButton: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '10px',
    textAlign: 'left',
    transition: 'all 0.2s',
  },

  roleButtonContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  roleCount: {
    fontSize: '12px',
    color: '#94a3b8',
    background: 'rgba(255,255,255,0.08)',
    padding: '2px 10px',
    borderRadius: '999px',
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '18px',
  },

  permissionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },

  permissionsCount: {
    fontSize: '13px',
    color: '#94a3b8',
  },

  moduleCard: {
    marginBottom: '20px',
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.06)',
  },

  moduleTitle: {
    marginTop: 0,
    marginBottom: '12px',
    fontSize: '15px',
    color: '#cbd5e1',
    fontWeight: '600',
  },

  permissionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '8px',
  },

  permissionItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  permissionName: {
    fontSize: '14px',
  },

  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#94a3b8',
    gap: '12px',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
    textAlign: 'center',
    gap: '12px',
  },
};