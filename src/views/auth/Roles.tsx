// src/views/auth/Roles.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
} from 'react-icons/fa';
import { useRoles } from '../../context/RolesContext';
import { usePermissions } from '../../hooks/usePermissions';

export default function Roles() {
  // ===== HOOKS =====
  const {
    roles,
    loading,
    pagination,
    permissions,
    rolePermissions,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    fetchPermissions,
    fetchRolePermissions,
    assignPermissionsToRole,
    removePermissionFromRole,
    selectedRole,
    fetchRoleById,
    clearSelectedRole,
    error,
    clearError,
  } = useRoles();

  const {
    canViewRoles,
    canCreateRoles,
    canEditRoles,
    canDeleteRoles,
    canAssignPermissions,
  } = usePermissions();

  // ===== ESTADOS LOCALES =====
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'delete' | 'permissions'>('create');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: true,
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const initialLoadDone = useRef(false);

  // ===== PERMISOS =====
  const canCreate = canCreateRoles();
  const canEdit = canEditRoles();
  const canDelete = canDeleteRoles();
  const canView = canViewRoles();
  const canAssign = canAssignPermissions();

  // =============================================
  // CARGA INICIAL
  // =============================================
  const loadRoles = useCallback(async () => {
    if (!canView) return;
    try {
      await fetchRoles({
        page: 1,
        limit: 10,
        search: search || undefined,
      });
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  }, [canView, fetchRoles, search]);

  useEffect(() => {
    if (canView && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadRoles();
      fetchPermissions(); // Cargar todos los permisos disponibles
    }
  }, [canView, loadRoles, fetchPermissions]);

  // Debounce para búsqueda
  useEffect(() => {
    if (!canView || !initialLoadDone.current) return;
    const timer = setTimeout(() => loadRoles(), 500);
    return () => clearTimeout(timer);
  }, [search, canView, loadRoles]);

  // =============================================
  // MANEJADORES DE MODAL
  // =============================================
  const openCreate = () => {
    setModalType('create');
    setSelectedRoleId(null);
    setFormData({ nombre: '', descripcion: '', estado: true });
    setSelectedPermissions([]);
    setIsModalOpen(true);
  };

  const openEdit = async (id: string) => {
    if (!canEdit) return;
    setModalType('edit');
    setSelectedRoleId(id);
    try {
      const role = await fetchRoleById(id);
      setFormData({
        nombre: role.nombre,
        descripcion: role.descripcion || '',
        estado: role.estado,
      });
      // Cargar permisos actuales del rol
      const perms = await fetchRolePermissions(id);
      setSelectedPermissions(perms.map(p => p.permissionId));
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error loading role:', err);
    }
  };

  const openView = async (id: string) => {
    if (!canView) return;
    setModalType('view');
    setSelectedRoleId(id);
    try {
      await fetchRoleById(id);
      await fetchRolePermissions(id);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error loading role:', err);
    }
  };

  const openDelete = (id: string) => {
    if (!canDelete) return;
    setModalType('delete');
    setSelectedRoleId(id);
    setIsModalOpen(true);
  };

  const openPermissions = async (id: string) => {
    if (!canAssign) return;
    setModalType('permissions');
    setSelectedRoleId(id);
    try {
      await fetchRoleById(id);
      const perms = await fetchRolePermissions(id);
      setSelectedPermissions(perms.map(p => p.permissionId));
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error loading permissions:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoleId(null);
    clearSelectedRole();
    setSelectedPermissions([]);
  };

  // =============================================
  // MANEJADORES CRUD
  // =============================================
  const handleSave = async () => {
    try {
      if (modalType === 'create') {
        if (!canCreate) {
          alert('No tienes permisos para crear roles');
          return;
        }
        await createRole({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          estado: formData.estado,
        });
      } else if (modalType === 'edit' && selectedRoleId) {
        if (!canEdit) {
          alert('No tienes permisos para editar roles');
          return;
        }
        await updateRole(selectedRoleId, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          estado: formData.estado,
        });
      } else if (modalType === 'permissions' && selectedRoleId) {
        if (!canAssign) {
          alert('No tienes permisos para asignar permisos');
          return;
        }
        await assignPermissionsToRole(selectedRoleId, selectedPermissions);
      }
      closeModal();
      await loadRoles();
    } catch (err: any) {
      console.error('Error saving:', err);
      alert(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!selectedRoleId || !canDelete) return;
    try {
      await deleteRole(selectedRoleId);
      closeModal();
      await loadRoles();
    } catch (err: any) {
      console.error('Error deleting:', err);
      alert(err.response?.data?.message || 'Error al eliminar el rol');
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handlePageChange = (page: number) => {
    fetchRoles({ page, limit: pagination.limit, search: search || undefined });
  };

  // =============================================
  // RENDER
  // =============================================

  if (!canView) {
    return (
      <div style={styles.container}>
        <div style={styles.unauthorized}>
          <FaUserShield size={60} color="#ef4444" />
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para ver esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Roles</h1>
          <p style={styles.subtitle}>Administra roles y permisos del sistema</p>
        </div>
        {canCreate && (
          <button style={styles.newButton} onClick={openCreate}>
            <FaPlus /> Nuevo Rol
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={clearError} style={styles.errorClose}>×</button>
        </div>
      )}

      {/* Filtros */}
      <div style={styles.filters}>
        <div style={styles.searchContainer}>
          <FaSearch color="#94a3b8" />
          <input
            style={styles.searchInput}
            placeholder="Buscar rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearSearch} onClick={() => setSearch('')}>
              ×
            </button>
          )}
        </div>
        <select
          style={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <span style={styles.resultCount}>
          {pagination.total} roles encontrados
        </span>
      </div>

      {/* Tabla */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loading}>
            <FaSpinner className="spinner" size={40} color="#3b82f6" />
            <p>Cargando roles...</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Permisos</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Usuarios</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: 'center', padding: '60px 20px' }}>
                    <FaUserShield size={48} color="#475569" />
                    <p style={{ marginTop: '12px', color: '#94a3b8' }}>No hay roles registrados</p>
                    {canCreate && (
                      <button style={styles.emptyStateButton} onClick={openCreate}>
                        <FaPlus /> Crear primer rol
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <strong>{role.nombre}</strong>
                    </td>
                    <td style={styles.td}>{role.descripcion || '—'}</td>
                    <td style={styles.td}>
                      <div style={styles.permissionsCell}>
                        {role.permissions?.slice(0, 3).map((rp) => (
                          <span key={rp.permissionId} style={styles.permissionBadge}>
                            {rp.permission?.nombre || '?'}
                          </span>
                        ))}
                        {role.permissions && role.permissions.length > 3 && (
                          <span style={styles.permissionBadgeMore}>
                            +{role.permissions.length - 3}
                          </span>
                        )}
                        {(!role.permissions || role.permissions.length === 0) && (
                          <span style={{ color: '#64748b', fontSize: '12px' }}>Sin permisos</span>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={getStatusBadgeStyle(role.estado)}>
                        {role.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.usersCount}>
                        <FaUsers size={14} color="#64748b" />
                        <span>{role._count?.users || 0}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        {canView && (
                          <button
                            style={{ ...styles.iconButton, color: '#60a5fa' }}
                            onClick={() => openView(role.id)}
                            title="Ver detalles"
                          >
                            <FaEye />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            style={{ ...styles.iconButton, color: '#fbbf24' }}
                            onClick={() => openEdit(role.id)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                        )}
                        {canAssign && (
                          <button
                            style={{ ...styles.iconButton, color: '#8b5cf6' }}
                            onClick={() => openPermissions(role.id)}
                            title="Gestionar permisos"
                          >
                            <FaUserShield />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            style={{ ...styles.iconButton, color: '#ef4444' }}
                            onClick={() => openDelete(role.id)}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{ ...styles.paginationButton, opacity: pagination.page === 1 ? 0.5 : 1 }}
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Anterior
            </button>
            <div style={styles.paginationPages}>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) pageNum = i + 1;
                else if (pagination.page <= 3) pageNum = i + 1;
                else if (pagination.page >= pagination.totalPages - 2)
                  pageNum = pagination.totalPages - 4 + i;
                else pageNum = pagination.page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    style={{
                      ...styles.pageButton,
                      background: pageNum === pagination.page ? '#3b82f6' : 'transparent',
                      color: pageNum === pagination.page ? '#fff' : '#94a3b8',
                    }}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              style={{ ...styles.paginationButton, opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {modalType === 'view' && selectedRole && (
              // === VER ROL ===
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Detalle del Rol</h2>
                  <button style={styles.modalClose} onClick={closeModal}>×</button>
                </div>
                <div style={styles.viewDetails}>
                  <div style={styles.viewRow}>
                    <strong>Nombre:</strong>
                    <span>{selectedRole.nombre}</span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Descripción:</strong>
                    <span>{selectedRole.descripcion || '—'}</span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Estado:</strong>
                    <span style={getStatusBadgeStyle(selectedRole.estado)}>
                      {selectedRole.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Usuarios asignados:</strong>
                    <span>{selectedRole._count?.users || 0}</span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Permisos:</strong>
                    <div style={styles.permissionsList}>
                      {rolePermissions.length > 0 ? (
                        rolePermissions.map(rp => (
                          <span key={rp.permissionId} style={styles.permissionBadge}>
                            {rp.permission?.nombre || rp.permissionId}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#64748b' }}>Ningún permiso asignado</span>
                      )}
                    </div>
                  </div>
                </div>
                <button style={styles.saveButton} onClick={closeModal}>Cerrar</button>
              </>
            )}

            {modalType === 'delete' && selectedRole && (
              // === ELIMINAR ===
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Eliminar Rol</h2>
                </div>
                <div style={styles.deleteModalContent}>
                  <FaTrash size={48} color="#ef4444" />
                  <p style={styles.modalText}>
                    ¿Estás seguro de eliminar el rol <strong>{selectedRole.nombre}</strong>?
                  </p>
                  <p style={styles.modalSubtext}>
                    Esta acción no se puede deshacer. Los usuarios con este rol perderán sus permisos.
                  </p>
                </div>
                <div style={styles.modalActions}>
                  <button style={styles.cancelButton} onClick={closeModal}>Cancelar</button>
                  <button style={styles.deleteButton} onClick={handleDelete}>Eliminar</button>
                </div>
              </>
            )}

            {(modalType === 'create' || modalType === 'edit') && (
              // === CREAR / EDITAR ROL ===
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    {modalType === 'create' ? 'Nuevo Rol' : 'Editar Rol'}
                  </h2>
                  <button style={styles.modalClose} onClick={closeModal}>×</button>
                </div>
                <div style={styles.modalForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Nombre del rol *</label>
                    <input
                      style={styles.modalInput}
                      placeholder="Ej: Supervisor"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Descripción</label>
                    <textarea
                      style={{ ...styles.modalInput, minHeight: '80px' }}
                      placeholder="Descripción del rol"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Estado</label>
                    <select
                      style={styles.modalInput}
                      value={formData.estado ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value === 'true' })}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div style={styles.modalActions}>
                  <button style={styles.cancelButton} onClick={closeModal}>Cancelar</button>
                  <button style={styles.saveButton} onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <>
                        <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                        Guardando...
                      </>
                    ) : (
                      'Guardar'
                    )}
                  </button>
                </div>
              </>
            )}

            {modalType === 'permissions' && selectedRole && (
              // === GESTIÓN DE PERMISOS ===
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    Permisos de <span style={{ color: '#60a5fa' }}>{selectedRole.nombre}</span>
                  </h2>
                  <button style={styles.modalClose} onClick={closeModal}>×</button>
                </div>
                <div style={styles.permissionsModal}>
                  <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
                    Selecciona los permisos que tendrá este rol:
                  </p>
                  <div style={styles.permissionsGrid}>
                    {permissions.map((perm) => (
                      <label key={perm.id} style={styles.permissionCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                        />
                        <span>{perm.nombre}</span>
                        {perm.modulo && (
                          <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '8px' }}>
                            ({perm.modulo})
                          </span>
                        )}
                      </label>
                    ))}
                    {permissions.length === 0 && (
                      <p style={{ color: '#64748b' }}>No hay permisos disponibles</p>
                    )}
                  </div>
                </div>
                <div style={styles.modalActions}>
                  <button style={styles.cancelButton} onClick={closeModal}>Cancelar</button>
                  <button style={styles.saveButton} onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <>
                        <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                        Guardando...
                      </>
                    ) : (
                      'Asignar permisos'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// FUNCIONES DE ESTILOS
// =============================================
const getStatusBadgeStyle = (estado?: boolean): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: '999px',
  fontWeight: 600,
  fontSize: '12px',
  background: estado ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
  color: estado ? '#22c55e' : '#ef4444',
});

// =============================================
// ESTILOS (iguales a los que ya tenías, solo ajusta los nuevos)
// =============================================
const styles: { [key: string]: React.CSSProperties } = {
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
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: '8px',
    fontSize: '15px',
  },
  newButton: {
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
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '0 15px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '14px 0',
    outline: 'none',
    fontSize: '14px',
  },
  clearSearch: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 4px',
  },
  select: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#fff',
    padding: '14px',
    minWidth: '180px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  resultCount: {
    color: '#94a3b8',
    fontSize: '14px',
    marginLeft: 'auto',
  },
  tableContainer: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
  },
  loading: {
    padding: '60px',
    textAlign: 'center',
    color: '#94a3b8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '18px',
    background: 'rgba(255,255,255,0.04)',
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '18px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: '14px',
  },
  tableRow: {
    transition: 'background 0.2s',
  },
  permissionsCell: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  permissionBadge: {
    padding: '4px 10px',
    borderRadius: '999px',
    background: 'rgba(59,130,246,0.15)',
    color: '#60a5fa',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  permissionBadgeMore: {
    padding: '4px 10px',
    borderRadius: '999px',
    background: 'rgba(148,163,184,0.15)',
    color: '#94a3b8',
    fontSize: '12px',
  },
  usersCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#94a3b8',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  iconButton: {
    width: '35px',
    height: '35px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontSize: '16px',
  },
  pagination: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  paginationButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    cursor: 'pointer',
  },
  paginationPages: {
    display: 'flex',
    gap: '6px',
  },
  pageButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
  },
  emptyStateButton: {
    marginTop: '16px',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
  },
  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '550px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '24px',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '0 8px',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  formGroup: {
    marginBottom: '12px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#cbd5e1',
    marginBottom: '6px',
  },
  modalInput: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  saveButton: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cancelButton: {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  deleteButton: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  viewDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  viewRow: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  permissionsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '4px',
  },
  deleteModalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 0',
  },
  modalText: {
    fontSize: '18px',
    lineHeight: '1.6',
    textAlign: 'center',
    margin: '12px 0 8px',
  },
  modalSubtext: {
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
  },
  permissionsModal: {
    marginTop: '8px',
  },
  permissionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '8px 0',
  },
  permissionCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
  },
};

// Agregar animaciones
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(styleSheet);