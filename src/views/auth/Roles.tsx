
// @ts-nocheck
import { useState } from 'react'
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
} from 'react-icons/fa'

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  status: 'Activo' | 'Inactivo'
  users: number
  createdAt: string
}

const availablePermissions = [
  'Dashboard',
  'Usuarios',
  'Roles',
  'Clientes',
  'Productos',
  'Ventas',
  'Compras',
  'Inventario',
  'Reportes',
  'Configuración',
]

const rolesMock: Role[] = [
  {
    id: 1,
    name: 'Administrador',
    description:
      'Acceso total al sistema',
    permissions: [
      'Dashboard',
      'Usuarios',
      'Roles',
      'Configuración',
      'Reportes',
    ],
    status: 'Activo',
    users: 8,
    createdAt: '12/05/2025',
  },
  {
    id: 2,
    name: 'Supervisor',
    description:
      'Control operativo',
    permissions: [
      'Dashboard',
      'Clientes',
      'Reportes',
    ],
    status: 'Activo',
    users: 15,
    createdAt: '20/05/2025',
  },
  {
    id: 3,
    name: 'Operador',
    description:
      'Operación diaria',
    permissions: ['Dashboard'],
    status: 'Activo',
    users: 32,
    createdAt: '01/06/2025',
  },
]

export default function Roles() {
  const [roles, setRoles] =
    useState<Role[]>(rolesMock)

  const [search, setSearch] =
    useState('')

  const [isModalOpen, setIsModalOpen] =
    useState(false)

  const [modalType, setModalType] =
    useState<
      'create' | 'edit' | 'view' | 'delete'
    >('create')

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null)

  const [formData, setFormData] =
    useState({
      name: '',
      description: '',
      permissions: [] as string[],
      status:
        'Activo' as
          | 'Activo'
          | 'Inactivo',
    })

  const filteredRoles = roles.filter(
    (role) =>
      role.name
        .toLowerCase()
        .includes(search.toLowerCase())
  )

  const openCreate = () => {
    setModalType('create')

    setFormData({
      name: '',
      description: '',
      permissions: [],
      status: 'Activo',
    })

    setIsModalOpen(true)
  }

  const openEdit = (role: Role) => {
    setModalType('edit')
    setSelectedRole(role)

    setFormData({
      name: role.name,
      description:
        role.description,
      permissions:
        role.permissions,
      status: role.status,
    })

    setIsModalOpen(true)
  }

  const openView = (role: Role) => {
    setModalType('view')
    setSelectedRole(role)
    setIsModalOpen(true)
  }

  const openDelete = (role: Role) => {
    setModalType('delete')
    setSelectedRole(role)
    setIsModalOpen(true)
  }

  const togglePermission = (
    permission: string
  ) => {
    const exists =
      formData.permissions.includes(
        permission
      )

    setFormData({
      ...formData,
      permissions: exists
        ? formData.permissions.filter(
            (p) => p !== permission
          )
        : [
            ...formData.permissions,
            permission,
          ],
    })
  }

  const handleSave = () => {
    if (modalType === 'create') {
      setRoles([
        ...roles,
        {
          id: Date.now(),
          name: formData.name,
          description:
            formData.description,
          permissions:
            formData.permissions,
          status:
            formData.status,
          users: 0,
          createdAt:
            new Date().toLocaleDateString(),
        },
      ])
    }

    if (
      modalType === 'edit' &&
      selectedRole
    ) {
      setRoles(
        roles.map((role) =>
          role.id === selectedRole.id
            ? {
                ...role,
                ...formData,
              }
            : role
        )
      )
    }

    setIsModalOpen(false)
  }

  const handleDelete = () => {
    if (!selectedRole) return

    setRoles(
      roles.filter(
        (role) =>
          role.id !== selectedRole.id
      )
    )

    setIsModalOpen(false)
  }

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Gestión de Roles
            </h1>

            <p style={styles.subtitle}>
              Administración de roles y
              permisos
            </p>
          </div>

          <button
            style={styles.newButton}
            onClick={openCreate}
          >
            <FaPlus />
            Nuevo Rol
          </button>
        </div>

        <div style={styles.filters}>
          <div
            style={
              styles.searchContainer
            }
          >
            <FaSearch color="#94a3b8" />

            <input
              style={
                styles.searchInput
              }
              placeholder="Buscar rol..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div
          style={
            styles.tableContainer
          }
        >
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  Rol
                </th>

                <th style={styles.th}>
                  Descripción
                </th>

                <th style={styles.th}>
                  Permisos
                </th>

                <th style={styles.th}>
                  Estado
                </th>

                <th style={styles.th}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRoles.map(
                (role) => (
                  <tr
                    key={role.id}
                  >
                    <td
                      style={
                        styles.td
                      }
                    >
                      {role.name}
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      {
                        role.description
                      }
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      <div
                        style={
                          styles.permissions
                        }
                      >
                        {role.permissions.map(
                          (
                            permission
                          ) => (
                            <span
                              key={
                                permission
                              }
                              style={
                                styles.permissionBadge
                              }
                            >
                              {
                                permission
                              }
                            </span>
                          )
                        )}
                      </div>
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      {role.status}
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      <div
                        style={
                          styles.actions
                        }
                      >
                        <button
                          style={
                            styles.iconButton
                          }
                          onClick={() =>
                            openView(
                              role
                            )
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          style={
                            styles.iconButton
                          }
                          onClick={() =>
                            openEdit(
                              role
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          style={{
                            ...styles.iconButton,
                            color:
                              '#ef4444',
                          }}
                          onClick={() =>
                            openDelete(
                              role
                            )
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          style={
            styles.modalOverlay
          }
        >
          <div
            style={styles.modal}
          >
            {(modalType ===
              'create' ||
              modalType ===
                'edit') && (
              <>
                <h2>
                  {modalType ===
                  'create'
                    ? 'Nuevo Rol'
                    : 'Editar Rol'}
                </h2>

                <input
                  style={
                    styles.modalInput
                  }
                  placeholder="Nombre"
                  value={
                    formData.name
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name:
                        e.target
                          .value,
                    })
                  }
                />

                <textarea
                  style={{
                    ...styles.modalInput,
                    minHeight:
                      '90px',
                  }}
                  placeholder="Descripción"
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target
                          .value,
                    })
                  }
                />

                <h4>
                  Permisos
                </h4>

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      'repeat(2,1fr)',
                    gap: '10px',
                  }}
                >
                  {availablePermissions.map(
                    (
                      permission
                    ) => (
                      <label
                        key={
                          permission
                        }
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(
                            permission
                          )}
                          onChange={() =>
                            togglePermission(
                              permission
                            )
                          }
                        />{' '}
                        {permission}
                      </label>
                    )
                  )}
                </div>

                <div
                  style={
                    styles.modalActions
                  }
                >
                  <button
                    style={
                      styles.cancelButton
                    }
                    onClick={() =>
                      setIsModalOpen(
                        false
                      )
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    style={
                      styles.saveButton
                    }
                    onClick={
                      handleSave
                    }
                  >
                    Guardar
                  </button>
                </div>
              </>
            )}

            {modalType ===
              'view' &&
              selectedRole && (
                <>
                  <h2>
                    Detalle del
                    Rol
                  </h2>

                  <p>
                    <strong>
                      Nombre:
                    </strong>{' '}
                    {
                      selectedRole.name
                    }
                  </p>

                  <p>
                    <strong>
                      Descripción:
                    </strong>{' '}
                    {
                      selectedRole.description
                    }
                  </p>

                  <button
                    style={
                      styles.saveButton
                    }
                    onClick={() =>
                      setIsModalOpen(
                        false
                      )
                    }
                  >
                    Cerrar
                  </button>
                </>
              )}

            {modalType ===
              'delete' &&
              selectedRole && (
                <>
                  <h2>
                    Eliminar Rol
                  </h2>

                  <p>
                    ¿Desea eliminar
                    el rol{' '}
                    <strong>
                      {
                        selectedRole.name
                      }
                    </strong>
                    ?
                  </p>

                  <div
                    style={
                      styles.modalActions
                    }
                  >
                    <button
                      style={
                        styles.cancelButton
                      }
                      onClick={() =>
                        setIsModalOpen(
                          false
                        )
                      }
                    >
                      Cancelar
                    </button>

                    <button
                      style={
                        styles.deleteButton
                      }
                      onClick={
                        handleDelete
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
          </div>
        </div>
      )}
    </>
  )
}






const styles: {
  [key: string]: React.CSSProperties
} = {
  container: {
    padding: '30px',
    minHeight: '100vh',
    background:
      'linear-gradient(135deg,#0f172a,#1e293b)',
    color: '#fff',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },

  title: {
    margin: 0,
    fontSize: '32px',
  },

  subtitle: {
    color: '#94a3b8',
    marginTop: '8px',
  },

  newButton: {
    border: 'none',
    padding: '12px 20px',
    borderRadius: '12px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    cursor: 'pointer',
    background:
      'linear-gradient(135deg,#3b82f6,#2563eb)',
    color: '#fff',
    fontWeight: 'bold',
  },

  cards: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(220px,1fr))',
    gap: '20px',
    marginBottom: '30px',
  },

  card: {
    background:
      'rgba(255,255,255,.08)',
    border:
      '1px solid rgba(255,255,255,.12)',
    borderRadius: '18px',
    padding: '20px',
    backdropFilter: 'blur(12px)',
  },

  cardTitle: {
    color: '#94a3b8',
    fontSize: '14px',
  },

  cardValue: {
    margin: '10px 0 0',
    fontSize: '28px',
  },

  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },

  searchContainer: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background:
      'rgba(255,255,255,.08)',
    border:
      '1px solid rgba(255,255,255,.12)',
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
  },

  select: {
    background:
      'rgba(255,255,255,.08)',
    border:
      '1px solid rgba(255,255,255,.12)',
    borderRadius: '12px',
    color: '#fff',
    padding: '14px',
  },

  tableContainer: {
    background:
      'rgba(255,255,255,.08)',
    border:
      '1px solid rgba(255,255,255,.12)',
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    textAlign: 'left',
    padding: '18px',
    background:
      'rgba(255,255,255,.05)',
    color: '#cbd5e1',
  },

  td: {
    padding: '18px',
    borderTop:
      '1px solid rgba(255,255,255,.08)',
  },

  badge: {
    padding: '6px 12px',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '12px',
  },

  actions: {
    display: 'flex',
    gap: '10px',
  },

  iconButton: {
    width: '35px',
    height: '35px',
    borderRadius: '8px',
    border:
      '1px solid rgba(255,255,255,.12)',
    background:
      'rgba(255,255,255,.05)',
    color: '#fff',
    cursor: 'pointer',
  },

  pagination: {
    padding: '20px',
    textAlign: 'center',
    color: '#94a3b8',
  },

  modalOverlay: {
  position: 'fixed',
  inset: 0,
  background:
    'rgba(0,0,0,.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},

modal: {
  width: '450px',
  background: '#0f172a',
  border:
    '1px solid rgba(255,255,255,.1)',
  borderRadius: '20px',
  padding: '25px',
},

modalInput: {
  width: '100%',
  padding: '14px',
  marginBottom: '12px',
  borderRadius: '12px',
  border:
    '1px solid rgba(255,255,255,.1)',
  background: '#1e293b',
  color: '#fff',
},

modalActions: {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '15px',
},

modalButton: {
  marginTop: '15px',
  padding: '10px 18px',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
},

saveButton: {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '10px',
  cursor: 'pointer',
},

cancelButton: {
  background: '#475569',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '10px',
  cursor: 'pointer',
},

deleteButton: {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '10px',
  cursor: 'pointer',
},
permissions: {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
},

permissionBadge: {
  padding: '4px 10px',
  borderRadius: '999px',
  background:
    'rgba(59,130,246,.15)',
  color: '#60a5fa',
  fontSize: '12px',
},
}

