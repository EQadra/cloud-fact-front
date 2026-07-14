import {
  FaShieldAlt,
  FaFlask,
  FaCog,
  FaCar,
  FaWalking,
  FaGlobe,
  FaBook,
  FaUsers,
  FaUserCheck,
  FaUserShield,
} from 'react-icons/fa'

export interface SubModule {
  id: string
  label: string
  path: string
  icon: any
  description: string
}

export interface Module {
  id: string
  title: string
  icon: any
  path: string
  description: string
  subModules: SubModule[]
}

export const modulesConfig: Module[] = [
  {
    id: 'seguridad',
    title: 'Seguridad',
    icon: FaShieldAlt,
    path: '/seguridad',
    description: 'Control de accesos y seguridad',
    subModules: [
      {
        id: 'access-car',
        label: 'Control Vehículos',
        path: '/seguridad/access-car',  // ← Ruta REAL de tu código
        icon: FaCar,
        description: 'Registro de ingresos/salidas de vehículos'
      },
      {
        id: 'access-control',
        label: 'Control Peatonal',
        path: '/seguridad/access-control',  // ← Ruta REAL de tu código
        icon: FaWalking,
        description: 'Registro de personas a pie'
      },
      {
        id: 'external-view',
        label: 'Visor Externo',
        path: '/seguridad/external-view',  // ← Ruta REAL de tu código
        icon: FaGlobe,
        description: 'Visualización de sistemas externos'
      },
      {
        id: 'incident-book',
        label: 'Libro Incidentes',
        path: '/seguridad/incident-book',  // ← Ruta REAL de tu código
        icon: FaBook,
        description: 'Libro de incidentes y novedades'
      }
    ]
  },
  {
    id: 'produccion',
    title: 'Producción',
    icon: FaFlask,
    path: '/produccion',
    description: 'Gestión de producción',
    subModules: [
      {
        id: 'trazabilidad',
        label: 'Trazabilidad',
        path: '/produccion/trazabilidad',
        icon: FaFlask,
        description: 'Gestión de trazabilidad de plantas'
      }
    ]
  },
  {
    id: 'configuracion',
    title: 'Configuración',
    icon: FaCog,
    path: '/configuracion',
    description: 'Configuración del sistema',
    subModules: [
      {
        id: 'users',
        label: 'Usuarios',
        path: '/users',  // ← Ruta REAL de tu código
        icon: FaUsers,
        description: 'Gestión de usuarios del sistema'
      },
      {
        id: 'roles',
        label: 'Roles',
        path: '/roles',  // ← Ruta REAL de tu código
        icon: FaUserCheck,
        description: 'Administración de roles'
      },
      {
        id: 'permissions',
        label: 'Permisos',
        path: '/permissions',  // ← Ruta REAL de tu código
        icon: FaUserShield,
        description: 'Configuración de permisos'
      }
    ]
  }
]