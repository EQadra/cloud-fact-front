// @ts-nocheck
import { useState } from 'react'
import { FaSave } from 'react-icons/fa'

interface Role {
  id: number
  name: string
}

interface Permission {
  id: number
  module: string
  name: string
}

const rolesMock: Role[] = [
  {
    id: 1,
    name: 'Administrador',
  },
  {
    id: 2,
    name: 'Supervisor',
  },
  {
    id: 3,
    name: 'Operador',
  },
  {
    id: 4,
    name: 'Vendedor',
  },
]

const permissionsMock: Permission[] = [
  { id: 1, module: 'Usuarios', name: 'Ver' },
  { id: 2, module: 'Usuarios', name: 'Crear' },
  { id: 3, module: 'Usuarios', name: 'Editar' },
  { id: 4, module: 'Usuarios', name: 'Eliminar' },

  { id: 5, module: 'Roles', name: 'Ver' },
  { id: 6, module: 'Roles', name: 'Crear' },
  { id: 7, module: 'Roles', name: 'Editar' },
  { id: 8, module: 'Roles', name: 'Eliminar' },

  { id: 9, module: 'Clientes', name: 'Ver' },
  { id: 10, module: 'Clientes', name: 'Crear' },
  { id: 11, module: 'Clientes', name: 'Editar' },
  { id: 12, module: 'Clientes', name: 'Eliminar' },

  { id: 13, module: 'Productos', name: 'Ver' },
  { id: 14, module: 'Productos', name: 'Crear' },
  { id: 15, module: 'Productos', name: 'Editar' },
  { id: 16, module: 'Productos', name: 'Eliminar' },

  { id: 17, module: 'Reportes', name: 'Ver' },
  { id: 18, module: 'Reportes', name: 'Exportar' },

  {
    id: 19,
    module: 'Configuración',
    name: 'Administrar',
  },
]

const rolePermissionsMock: Record<
  number,
  number[]
> = {
  1: permissionsMock.map(
    (p) => p.id
  ),
  2: [1, 2, 3, 9, 10, 11, 17],
  3: [1, 9, 13],
  4: [9, 10, 13, 17],
}

export default function PermissionsByRole() {
  const [selectedRole, setSelectedRole] =
    useState<number>(1)

  const [
    rolePermissions,
    setRolePermissions,
  ] = useState(rolePermissionsMock)

  const selectedPermissions =
    rolePermissions[selectedRole] || []

  const groupedPermissions =
    permissionsMock.reduce(
      (acc, permission) => {
        if (!acc[permission.module]) {
          acc[permission.module] = []
        }

        acc[permission.module].push(
          permission
        )

        return acc
      },
      {} as Record<
        string,
        Permission[]
      >
    )

  const togglePermission = (
    permissionId: number
  ) => {
    const current =
      rolePermissions[selectedRole] || []

    const exists =
      current.includes(permissionId)

    setRolePermissions({
      ...rolePermissions,
      [selectedRole]: exists
        ? current.filter(
            (id) =>
              id !== permissionId
          )
        : [...current, permissionId],
    })
  }

  const handleSave = () => {
    console.log(rolePermissions)

    alert(
      'Permisos guardados (mock)'
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Permisos por Rol
          </h1>

          <p style={styles.subtitle}>
            Gestión de accesos y
            privilegios
          </p>
        </div>

        <button
          style={styles.saveButton}
          onClick={handleSave}
        >
          <FaSave />
          Guardar Cambios
        </button>
      </div>

      <div style={styles.content}>
        {/* ROLES */}

        <div style={styles.rolesPanel}>
          <h3 style={styles.sectionTitle}>
            Roles
          </h3>

          {rolesMock.map((role) => (
            <button
              key={role.id}
              onClick={() =>
                setSelectedRole(
                  role.id
                )
              }
              style={{
                ...styles.roleButton,
                background:
                  selectedRole ===
                  role.id
                    ? '#2563eb'
                    : 'rgba(255,255,255,.05)',
              }}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* PERMISOS */}

        <div
          style={
            styles.permissionsPanel
          }
        >
          <h3 style={styles.sectionTitle}>
            Permisos del Rol
          </h3>

          {Object.entries(
            groupedPermissions
          ).map(
            ([
              module,
              permissions,
            ]) => (
              <div
                key={module}
                style={
                  styles.moduleCard
                }
              >
                <h4
                  style={
                    styles.moduleTitle
                  }
                >
                  {module}
                </h4>

                <div
                  style={
                    styles.permissionsGrid
                  }
                >
                  {permissions.map(
                    (
                      permission
                    ) => (
                      <label
                        key={
                          permission.id
                        }
                        style={
                          styles.permissionItem
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(
                            permission.id
                          )}
                          onChange={() =>
                            togglePermission(
                              permission.id
                            )
                          }
                        />

                        {
                          permission.name
                        }
                      </label>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  container: {
    padding: '30px',
    minHeight: '100vh',
    background:
      'linear-gradient(135deg,#0f172a,#1e293b)',
    color: '#fff',
  },

  header: {
    display: 'flex',
    justifyContent:
      'space-between',
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

  content: {
    display: 'grid',
    gridTemplateColumns:
      '280px 1fr',
    gap: '20px',
  },

  rolesPanel: {
    background:
      'rgba(255,255,255,.08)',
    border:
      '1px solid rgba(255,255,255,.12)',
    borderRadius: '20px',
    padding: '20px',
    height: 'fit-content',
  },

  permissionsPanel: {
    background:
      'rgba(255,255,255,.08)',
    border:
      '1px solid rgba(255,255,255,.12)',
    borderRadius: '20px',
    padding: '20px',
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
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: '20px',
  },

  moduleCard: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '12px',
    background:
      'rgba(255,255,255,.04)',
  },

  moduleTitle: {
    marginTop: 0,
  },

  permissionsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(180px,1fr))',
    gap: '10px',
  },

  permissionItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },

  saveButton: {
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
}