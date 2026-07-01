
// @ts-nocheck
import { useState } from 'react'
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
} from 'react-icons/fa'

const usersMock = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@empresa.com',
    role: 'Administrador',
    status: 'Activo',
    createdAt: '12/05/2025',
  },
  {
    id: 2,
    name: 'María López',
    email: 'maria@empresa.com',
    role: 'Operador',
    status: 'Activo',
    createdAt: '20/05/2025',
  },
  {
    id: 3,
    name: 'Carlos Díaz',
    email: 'carlos@empresa.com',
    role: 'Supervisor',
    status: 'Inactivo',
    createdAt: '01/06/2025',
  },
]

export default function Users() {
  const [users, setUsers] =
    useState(usersMock)

  const [search, setSearch] =
    useState('')

  const [isModalOpen, setIsModalOpen] =
    useState(false)

  const [modalType, setModalType] =
    useState<
      'create' | 'edit' | 'view' | 'delete'
    >('create')

  const [selectedUser, setSelectedUser] =
    useState<any>(null)

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      role: 'Operador',
      status: 'Activo',
    })

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  )

  const openCreate = () => {
    setModalType('create')

    setFormData({
      name: '',
      email: '',
      role: 'Operador',
      status: 'Activo',
    })

    setIsModalOpen(true)
  }

  const openEdit = (user: any) => {
    setModalType('edit')
    setSelectedUser(user)

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })

    setIsModalOpen(true)
  }

  const openView = (user: any) => {
    setModalType('view')
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const openDelete = (user: any) => {
    setModalType('delete')
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (modalType === 'create') {
      setUsers([
        ...users,
        {
          id: Date.now(),
          ...formData,
          createdAt:
            new Date().toLocaleDateString(),
        },
      ])
    }

    if (modalType === 'edit') {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                ...formData,
              }
            : u
        )
      )
    }

    setIsModalOpen(false)
  }

  const handleDelete = () => {
    setUsers(
      users.filter(
        (u) => u.id !== selectedUser.id
      )
    )

    setIsModalOpen(false)
  }

  const totalUsers = users.length
  const activeUsers = users.filter(
    (u) => u.status === 'Activo'
  ).length

  const inactiveUsers = users.filter(
    (u) => u.status === 'Inactivo'
  ).length

  const admins = users.filter(
    (u) => u.role === 'Administrador'
  ).length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Gestión de Usuarios
          </h1>

          <p style={styles.subtitle}>
            Administra usuarios y permisos
          </p>
        </div>

        <button
          style={styles.newButton}
          onClick={openCreate}
        >
          <FaPlus />
          Nuevo Usuario
        </button>
      </div>

      <div style={styles.cards}>
        <Card
          title="Total Usuarios"
          value={String(totalUsers)}
        />

        <Card
          title="Activos"
          value={String(activeUsers)}
        />

        <Card
          title="Inactivos"
          value={String(inactiveUsers)}
        />

        <Card
          title="Administradores"
          value={String(admins)}
        />
      </div>

      <div style={styles.filters}>
        <div style={styles.searchContainer}>
          <FaSearch color="#94a3b8" />

          <input
            style={styles.searchInput}
            placeholder="Buscar..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                Usuario
              </th>
              <th style={styles.th}>
                Correo
              </th>
              <th style={styles.th}>Rol</th>
              <th style={styles.th}>
                Estado
              </th>
              <th style={styles.th}>
                Registro
              </th>
              <th style={styles.th}>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>
                  {user.name}
                </td>

                <td style={styles.td}>
                  {user.email}
                </td>

                <td style={styles.td}>
                  {user.role}
                </td>

                <td style={styles.td}>
                  {user.status}
                </td>

                <td style={styles.td}>
                  {user.createdAt}
                </td>

                <td style={styles.td}>
                  <div
                    style={styles.actions}
                  >
                    <button
                      style={
                        styles.iconButton
                      }
                      onClick={() =>
                        openView(user)
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      style={
                        styles.iconButton
                      }
                      onClick={() =>
                        openEdit(user)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      style={{
                        ...styles.iconButton,
                        color: '#ef4444',
                      }}
                      onClick={() =>
                        openDelete(user)
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {modalType === 'view' ? (
              <>
                <h2>Detalle Usuario</h2>

                <p>
                  <strong>Nombre:</strong>{' '}
                  {selectedUser.name}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {selectedUser.email}
                </p>

                <p>
                  <strong>Rol:</strong>{' '}
                  {selectedUser.role}
                </p>

                <p>
                  <strong>Estado:</strong>{' '}
                  {selectedUser.status}
                </p>

                <button
                  style={styles.saveButton}
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                >
                  Cerrar
                </button>
              </>
            ) : modalType === 'delete' ? (
              <>
                <h2>
                  Eliminar Usuario
                </h2>

                <p>
                  ¿Desea eliminar a{' '}
                  {
                    selectedUser.name
                  }
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
            ) : (
              <>
                <h2>
                  {modalType ===
                  'create'
                    ? 'Nuevo Usuario'
                    : 'Editar Usuario'}
                </h2>

                <input
                  style={
                    styles.modalInput
                  }
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name:
                        e.target.value,
                    })
                  }
                />

                <input
                  style={
                    styles.modalInput
                  }
                  placeholder="Correo"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email:
                        e.target.value,
                    })
                  }
                />

                <select
                  style={
                    styles.modalInput
                  }
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role:
                        e.target.value,
                    })
                  }
                >
                  <option>
                    Administrador
                  </option>
                  <option>
                    Supervisor
                  </option>
                  <option>
                    Operador
                  </option>
                </select>

                <select
                  style={
                    styles.modalInput
                  }
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option>
                    Activo
                  </option>
                  <option>
                    Inactivo
                  </option>
                </select>

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
          </div>
        </div>
      )}
    </div>
  )
}

function Card({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div style={styles.card}>
      <span>{title}</span>
      <h2>{value}</h2>
    </div>
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
}