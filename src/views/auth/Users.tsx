// src/pages/Users.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaUserCog,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUserCircle,
  FaSpinner,
} from 'react-icons/fa';
import { useUsers } from '../../context/UsersContext';
import { usePermissions } from '../../hooks/usePermissions';

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export default function Users() {
  // ===== HOOKS =====
  const {
    users,
    loading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    roles,
    companies,
    selectedUser,
    fetchUserById,
    clearSelectedUser,
    getUserStatistics,
    error,
    clearError,
  } = useUsers();

  const {
    canViewUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canToggleUserStatus,
    isSuperAdmin,
    isAdmin,
  } = usePermissions();

  // ===== ESTADOS LOCALES =====
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'delete'>('create');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    roleId: '',
    companyId: '',
    telefono: '',
  });
  const [statistics, setStatistics] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);

  // ===== PERMISOS =====
  const canCreate = canCreateUsers();
  const canEdit = canEditUsers();
  const canDelete = canDeleteUsers();
  const canView = canViewUsers();
  const canToggle = canToggleUserStatus();
  const isAdminOrSuper = isAdmin() || isSuperAdmin();

  // ===== EFECTOS =====
  useEffect(() => {
    if (canView) {
      loadUsers();
      loadStatistics();
    }
  }, []);

  const loadUsers = useCallback(async () => {
    if (!canView) return;
    await fetchUsers({
      page: pagination.page,
      limit: pagination.limit,
      search: search || undefined,
      roleId: filterRole !== 'all' ? filterRole : undefined,
      estado: filterStatus !== 'all' ? filterStatus === 'active' : undefined,
    });
  }, [canView, fetchUsers, pagination.page, pagination.limit, search, filterRole, filterStatus]);

  const loadStatistics = useCallback(async () => {
    if (!canView) return;
    try {
      const stats = await getUserStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, [canView, getUserStatistics]);

  // ===== MANEJADORES DE FILTROS =====
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, filterStatus, filterRole, loadUsers]);

  // ===== MANEJADORES DE MODAL =====
  const openCreate = () => {
    setModalType('create');
    setSelectedUserId(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      roleId: '',
      companyId: '',
      telefono: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = async (id: string) => {
    if (!canEdit) return;
    setModalType('edit');
    setSelectedUserId(id);
    try {
      const user = await fetchUserById(id);
      setFormData({
        nombre: user.nombre,
        email: user.email,
        password: '',
        roleId: user.roleId,
        companyId: user.companyId || '',
        telefono: user.telefono || '',
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const openView = async (id: string) => {
    if (!canView) return;
    setModalType('view');
    setSelectedUserId(id);
    try {
      await fetchUserById(id);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const openDelete = (id: string) => {
    if (!canDelete) return;
    setModalType('delete');
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    clearSelectedUser();
  };

  // ===== MANEJADORES DE CRUD =====
  const handleSave = async () => {
    try {
      if (modalType === 'create') {
        if (!canCreate) {
          alert('No tienes permisos para crear usuarios');
          return;
        }
        await createUser({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password || 'default123',
          roleId: formData.roleId,
          companyId: formData.companyId || undefined,
          telefono: formData.telefono || undefined,
        });
      } else if (modalType === 'edit' && selectedUserId) {
        if (!canEdit) {
          alert('No tienes permisos para editar usuarios');
          return;
        }
        await updateUser(selectedUserId, {
          nombre: formData.nombre,
          email: formData.email,
          roleId: formData.roleId,
          companyId: formData.companyId || undefined,
          telefono: formData.telefono || undefined,
        });
      }
      closeModal();
      await loadUsers();
      await loadStatistics();
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Error al guardar el usuario');
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId || !canDelete) return;
    try {
      await deleteUser(selectedUserId);
      closeModal();
      await loadUsers();
      await loadStatistics();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (!canToggle) return;
    try {
      await toggleUserStatus(id);
      await loadUsers();
      await loadStatistics();
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      alert(error.response?.data?.message || 'Error al cambiar el estado del usuario');
    }
  };

  const handlePageChange = (page: number) => {
    fetchUsers({ page, limit: pagination.limit });
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
          <h1 style={styles.title}>
            <FaUserCog style={styles.titleIcon} />
            Gestión de Usuarios
          </h1>
          <p style={styles.subtitle}>
            Administra usuarios y permisos del sistema
          </p>
        </div>
        {canCreate && (
          <button style={styles.newButton} onClick={openCreate}>
            <FaPlus />
            Nuevo Usuario
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

      {/* Cards de estadísticas */}
      <div style={styles.cards}>
        <Card
          icon={<FaUserShield />}
          title="Total Usuarios"
          value={String(statistics?.total || 0)}
          color="#3b82f6"
        />
        <Card
          icon={<FaUserCheck />}
          title="Activos"
          value={String(statistics?.active || 0)}
          color="#22c55e"
        />
        <Card
          icon={<FaUserTimes />}
          title="Inactivos"
          value={String(statistics?.inactive || 0)}
          color="#ef4444"
        />
        <Card
          icon={<FaUserShield />}
          title="Administradores"
          value={String(statistics?.byRole?.Administrador || 0)}
          color="#8b5cf6"
        />
      </div>

      {/* Filtros */}
      <div style={styles.filters}>
        <div style={styles.searchContainer}>
          <FaSearch color="#94a3b8" />
          <input
            style={styles.searchInput}
            placeholder="Buscar por nombre, email..."
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
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <select
          style={styles.select}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">Todos los roles</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.nombre}
            </option>
          ))}
        </select>

        <span style={styles.resultCount}>
          {pagination.total} usuarios encontrados
        </span>
      </div>

      {/* Tabla de usuarios */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loading}>
            <FaSpinner className="spinner" size={40} color="#3b82f6" />
            <p>Cargando usuarios...</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Correo</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Empresa</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Registro</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '60px 20px' }}>
                    <FaUserCircle size={48} color="#475569" />
                    <p style={{ marginTop: '12px', color: '#94a3b8' }}>
                      No hay usuarios registrados
                    </p>
                    {canCreate && (
                      <button style={styles.emptyStateButton} onClick={openCreate}>
                        <FaPlus /> Crear primer usuario
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                          {user.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.userName}>{user.nombre}</div>
                          <div style={styles.userDetail}>
                            <FaPhone size={12} style={{ marginRight: '4px' }} />
                            {user.telefono || 'Sin teléfono'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.emailCell}>
                        <FaEnvelope size={14} color="#64748b" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={getRoleBadgeStyle(user.role?.nombre || '')}>
                        {user.role?.nombre || 'Sin rol'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.companyCell}>
                        <FaBuilding size={14} color="#64748b" />
                        <span>{user.company?.razonSocial || 'Sin empresa'}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={getStatusBadgeStyle(user.estado)}>
                        {user.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateCell}>
                        <FaCalendarAlt size={12} color="#64748b" />
                        <span>
                          {user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString('es-PE')
                            : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        {canView && (
                          <button
                            style={{ ...styles.iconButton, color: '#60a5fa' }}
                            onClick={() => openView(user.id)}
                            title="Ver detalles"
                            className="action-btn view-btn"
                          >
                            <FaEye />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            style={{ ...styles.iconButton, color: '#fbbf24' }}
                            onClick={() => openEdit(user.id)}
                            title="Editar"
                            className="action-btn edit-btn"
                          >
                            <FaEdit />
                          </button>
                        )}
                        {canToggle && (
                          <button
                            style={{
                              ...styles.iconButton,
                              color: user.estado ? '#ef4444' : '#22c55e',
                            }}
                            onClick={() => handleToggleStatus(user.id)}
                            title={user.estado ? 'Desactivar' : 'Activar'}
                            className="action-btn toggle-btn"
                          >
                            {user.estado ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                        )}
                        {canDelete && user.id !== '1' && (
                          <button
                            style={{ ...styles.iconButton, color: '#ef4444' }}
                            onClick={() => openDelete(user.id)}
                            title="Eliminar"
                            className="action-btn delete-btn"
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
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
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

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {modalType === 'view' && selectedUser ? (
              // ===== MODAL VER =====
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    <FaUserCircle size={24} color="#3b82f6" />
                    Detalle de Usuario
                  </h2>
                  <button style={styles.modalClose} onClick={closeModal}>×</button>
                </div>
                <div style={styles.viewDetails}>
                  <div style={styles.viewAvatar}>
                    {selectedUser.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Nombre completo:</strong>
                    <span>{selectedUser.nombre}</span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Correo electrónico:</strong>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Rol:</strong>
                    <span style={getRoleBadgeStyle(selectedUser.role?.nombre || '')}>
                      {selectedUser.role?.nombre || 'Sin rol'}
                    </span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Empresa:</strong>
                    <span>{selectedUser.company?.razonSocial || 'Sin empresa'}</span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Teléfono:</strong>
                    <span>{selectedUser.telefono || 'No registrado'}</span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Estado:</strong>
                    <span style={getStatusBadgeStyle(selectedUser.estado)}>
                      {selectedUser.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Registrado:</strong>
                    <span>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString('es-PE')
                        : 'N/A'}
                    </span>
                  </div>
                  <div style={styles.viewRow}>
                    <strong>Último acceso:</strong>
                    <span>
                      {selectedUser.ultimoAcceso
                        ? new Date(selectedUser.ultimoAcceso).toLocaleString('es-PE')
                        : 'Nunca'}
                    </span>
                  </div>
                </div>
                <button style={styles.saveButton} onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : modalType === 'delete' ? (
              // ===== MODAL ELIMINAR =====
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Eliminar Usuario</h2>
                </div>
                <div style={styles.deleteModalContent}>
                  <FaTrash size={48} color="#ef4444" />
                  <p style={styles.modalText}>
                    ¿Estás seguro de eliminar a <strong>{selectedUser?.nombre}</strong>?
                  </p>
                  <p style={styles.modalSubtext}>
                    Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
                  </p>
                </div>
                <div style={styles.modalActions}>
                  <button style={styles.cancelButton} onClick={closeModal}>
                    Cancelar
                  </button>
                  <button style={styles.deleteButton} onClick={handleDelete}>
                    Eliminar
                  </button>
                </div>
              </>
            ) : (
              // ===== MODAL CREAR/EDITAR =====
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    {modalType === 'create' ? (
                      <>
                        <FaPlus size={20} color="#3b82f6" />
                        Nuevo Usuario
                      </>
                    ) : (
                      <>
                        <FaEdit size={20} color="#fbbf24" />
                        Editar Usuario
                      </>
                    )}
                  </h2>
                  <button style={styles.modalClose} onClick={closeModal}>×</button>
                </div>

                <div style={styles.modalForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Nombre completo *</label>
                    <input
                      style={styles.modalInput}
                      placeholder="Ej: Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Correo electrónico *</label>
                    <input
                      style={styles.modalInput}
                      placeholder="Ej: juan@empresa.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {modalType === 'create' && (
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Contraseña *</label>
                      <div style={styles.passwordWrapper}>
                        <input
                          style={styles.modalInput}
                          placeholder="Mínimo 8 caracteres"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          style={styles.passwordToggle}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Rol *</label>
                    <select
                      style={styles.modalInput}
                      value={formData.roleId}
                      onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Empresa</label>
                    <select
                      style={styles.modalInput}
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    >
                      <option value="">Seleccionar empresa</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.razonSocial}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Teléfono</label>
                    <input
                      style={styles.modalInput}
                      placeholder="Ej: 987654321"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>

                <div style={styles.modalActions}>
                  <button style={styles.cancelButton} onClick={closeModal}>
                    Cancelar
                  </button>
                  <button
                    style={styles.saveButton}
                    onClick={handleSave}
                    disabled={loading}
                  >
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
          </div>
        </div>
      )}

      {/* Estilos globales para animaciones */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .action-btn {
            transition: all 0.2s ease;
          }
          .action-btn:hover {
            transform: scale(1.1);
          }
          .view-btn:hover { background: rgba(96, 165, 250, 0.2); }
          .edit-btn:hover { background: rgba(251, 191, 36, 0.2); }
          .toggle-btn:hover { background: rgba(34, 197, 94, 0.2); }
          .delete-btn:hover { background: rgba(239, 68, 68, 0.2); }
        `}
      </style>
    </div>
  );
}

// =============================================
// COMPONENTES SECUNDARIOS
// =============================================

function Card({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardIcon, background: color }}>
        {icon}
      </div>
      <div>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardValue}>{value}</div>
      </div>
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

const getRoleBadgeStyle = (role: string): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: '999px',
  fontWeight: 600,
  fontSize: '12px',
  background: role === 'Administrador' ? 'rgba(139,92,246,0.15)' : 
               role === 'Supervisor' ? 'rgba(59,130,246,0.15)' : 
               'rgba(148,163,184,0.15)',
  color: role === 'Administrador' ? '#8b5cf6' : 
         role === 'Supervisor' ? '#3b82f6' : 
         '#94a3b8',
});

// =============================================
// ESTILOS
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
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  titleIcon: {
    color: '#3b82f6',
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
    transition: 'transform 0.2s, box-shadow 0.2s',
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

  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },

  card: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '20px',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'transform 0.2s',
  },

  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#fff',
  },

  cardTitle: {
    color: '#94a3b8',
    fontSize: '14px',
  },

  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '4px',
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
    position: 'relative',
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

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#fff',
    flexShrink: 0,
  },

  userName: {
    fontWeight: '500',
  },

  userDetail: {
    fontSize: '12px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
  },

  emailCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  companyCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  dateCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
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
    transition: 'all 0.2s',
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
    animation: 'fadeIn 0.2s ease',
  },

  modal: {
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    animation: 'slideUp 0.3s ease',
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
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  modalClose: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '0 8px',
    transition: 'color 0.2s',
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
    transition: 'border-color 0.2s',
  },

  passwordWrapper: {
    position: 'relative',
  },

  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
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
    transition: 'all 0.2s',
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
    transition: 'all 0.2s',
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
    transition: 'all 0.2s',
  },

  // View Modal
  viewDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },

  viewAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 auto 16px',
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

  deleteModalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 0',
  },
};

// Agregar estilos de animación globales
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);