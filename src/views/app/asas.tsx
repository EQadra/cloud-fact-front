// src/views/app/Dashboards.tsx
// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FaChartLine,
  FaUsers,
  FaSignOutAlt,
  // FaCashRegister,
  // FaFolder,
  // FaBox,
  // FaBriefcase,
  // FaFlag,
  // FaShoppingCart,
  FaChevronDown,
  FaChevronRight,
  // FaGlobe,
  // FaFileInvoice,
  // FaFileAlt,
  FaCog,
  // FaBuilding,
  // FaUniversity,
  // FaCode,
  // FaUserCircle,
  FaShieldAlt,
  FaFlask,
  // FaStethoscope,
  // FaClipboardList,
  FaUserCheck,
  // FaLeaf,
  // FaPills,
  // FaUserMd,
  FaCar,
  FaWalking,
  FaBook,
  FaGlobe as FaGlobeIcon,
} from 'react-icons/fa'

const Dashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // Menú del Sidebar
  const sidebarMenus = [
    // =========================================
    // MÓDULO DE SEGURIDAD
    // =========================================
    {
      title: 'Seguridad',
      icon: <FaShieldAlt />,
      items: [
             { label: 'Control Vehículos', path: '/seguridad/acceso-vehicular' }, // ✅ CORREGIDO
        { label: 'Control Peatonal', path: '/seguridad/acceso-peatonal' },    // ✅ CORREGIDO
        { label: 'Visor Externo', path: '/seguridad/external' },              // ✅ CORREGIDO
        { label: 'Libro de Incidentes', path: '/seguridad/incidentes' },      // ✅ CORREGIDO
      ],
    },

    // =========================================
    // MÓDULO DE PRODUCCIÓN
    // =========================================
    {
      title: 'Producción',
      icon: <FaFlask />,
      items: [
        { label: 'Trazabilidad', path: '/produccion/trazabilidad' },
        // { label: 'Nueva Planta', path: '/produccion/trazabilidad/nuevo' },
      ],
    },

    // =========================================
    // MÓDULO DE CONFIGURACIÓN
    // =========================================
    {
      title: 'Configuración',
      icon: <FaCog />,
      items: [
        { label: 'Usuarios', path: '/users' },
        { label: 'Roles', path: '/roles' },
        { label: 'Permisos', path: '/permissions' },
      ],
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Módulos para tarjetas en el Main
  const modules = [
    // =========================================
    // MÓDULOS DE SEGURIDAD
    // =========================================
    { 
      title: 'Control Vehículos', 
      icon: <FaCar />, 
      path: '/seguridad/access-car',
      color: '#3b82f6',
      description: 'Registro de ingresos/salidas de vehículos'
    },
    { 
      title: 'Control Acceso',  // ← ACTUALIZADO
      icon: <FaWalking />, 
      path: '/seguridad/access-control',  // ← ACTUALIZADO
      color: '#22c55e',
      description: 'Registro de personas a pie'
    },
    { 
      title: 'Cámaras', 
      icon: <FaGlobeIcon />, 
      path: '/seguridad/external-view',
      color: '#8b5cf6',
      description: 'Visualización de sistemas externos'
    },
    { 
      title: 'Concurrencias', 
      icon: <FaBook />, 
      path: '/seguridad/incident-book',
      color: '#f59e0b',
      description: 'Libro de incidentes y novedades'
    },

    // =========================================
    // MÓDULO DE PRODUCCIÓN
    // =========================================
    { 
      title: 'Trazabilidad', 
      icon: <FaFlask />, 
      path: '/produccion/trazabilidad',
      color: '#10b981',
      description: 'Gestión de trazabilidad de plantas'
    },

    // =========================================
    // MÓDULO DE CONFIGURACIÓN
    // =========================================
    { 
      title: 'Usuarios', 
      icon: <FaUsers />, 
      path: '/users',
      color: '#6b7280',
      description: 'Gestión de usuarios del sistema'
    },
    { 
      title: 'Roles', 
      icon: <FaUserCheck />, 
      path: '/roles',
      color: '#8b5cf6',
      description: 'Administración de roles'
    },
    { 
      title: 'Permisos', 
      icon: <FaShieldAlt />, 
      path: '/permissions',
      color: '#ef4444',
      description: 'Configuración de permisos'
    },
  ]

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div>
            <h2 style={styles.logo}>CloudFact</h2>

            <nav style={styles.nav}>
              <button style={styles.navButton} onClick={() => navigate('/dashboard')}>
                <FaChartLine />
                Dashboard
              </button>

              {sidebarMenus.map((menu) => (
                <div key={menu.title}>
                  <button
                    style={styles.menuButton}
                    onClick={() => setOpenMenu(openMenu === menu.title ? null : menu.title)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {menu.icon}
                      {menu.title}
                    </div>
                    {openMenu === menu.title ? <FaChevronDown /> : <FaChevronRight />}
                  </button>

                  {openMenu === menu.title && (
                    <div style={styles.subMenu}>
                      {menu.items.map((item) => (
                        <button
                          key={item.label}
                          style={styles.subMenuButton}
                          onClick={() => navigate(item.path)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <button style={styles.logoutButton} onClick={handleLogout}>
            <FaSignOutAlt />
            Cerrar sesión
          </button>
        </aside>

        {/* MAIN */}
        <main style={styles.main}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Bienvenido al Panel</h1>
              <p style={styles.subtitle}>Sistema de Gestión y Control de Seguridad</p>
            </div>

            <div style={styles.profile}>
              <img src="https://i.pravatar.cc/100" alt="Perfil" style={styles.profileImage} />
              <div>
                <h3 style={styles.profileName}>Admin</h3>
                <span style={styles.profileRole}>Administrador</span>
              </div>
            </div>
          </div>

          {/* KPIS */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span>Registros Vehículos</span>
              <h2>1,254</h2>
            </div>
            <div style={styles.statCard}>
              <span>Registros Peatonales</span>
              <h2>3,521</h2>
            </div>
            <div style={styles.statCard}>
              <span>Incidentes</span>
              <h2>42</h2>
            </div>
            <div style={styles.statCard}>
              <span>Usuarios Activos</span>
              <h2>18</h2>
            </div>
          </div>

          {/* MÓDULOS */}
          <div style={styles.modulesGrid}>
            {modules.map((module) => (
              <div
                key={module.title}
                style={{
                  ...styles.moduleCard,
                  borderLeft: `4px solid ${module.color || '#60a5fa'}`
                }}
                onClick={() => navigate(module.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,.25)'
                }}
              >
                <div style={{ ...styles.moduleIcon, color: module.color || '#60a5fa' }}>
                  {module.icon}
                </div>
                <span style={styles.moduleTitle}>{module.title}</span>
                {module.description && (
                  <span style={styles.moduleDescription}>{module.description}</span>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// Estilos (mantener igual que antes)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#020617,#0f172a,#1e293b)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Arial,sans-serif',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at top left, rgba(59,130,246,.25), transparent 30%), radial-gradient(circle at bottom right, rgba(168,85,247,.25), transparent 30%)',
    filter: 'blur(40px)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '260px',
    background: 'rgba(255,255,255,.08)',
    backdropFilter: 'blur(12px)',
    borderRight: '1px solid rgba(255,255,255,.1)',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto',
  },
  logo: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '40px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255,255,255,.05)',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    transition: 'all .3s ease',
  },
  logoutButton: {
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all .3s ease',
  },
  main: {
    flex: 1,
    padding: '40px',
    color: '#fff',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '35px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    margin: 0,
    fontSize: '42px',
    background: 'linear-gradient(135deg,#60a5fa,#a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#cbd5e1',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.1)',
    padding: '12px 18px',
    borderRadius: '18px',
  },
  profileImage: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
  },
  profileName: {
    margin: 0,
  },
  profileRole: {
    color: '#cbd5e1',
    fontSize: '13px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
    gap: '20px',
    marginBottom: '35px',
  },
  statCard: {
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.1)',
    borderRadius: '18px',
    padding: '25px',
    backdropFilter: 'blur(12px)',
    transition: 'all .3s ease',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
    gap: '22px',
  },
  moduleCard: {
    background: 'rgba(255,255,255,.08)',
    border: '1px solid rgba(255,255,255,.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    padding: '25px',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all .3s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,.25)',
  },
  moduleIcon: {
    fontSize: '34px',
  },
  moduleTitle: {
    fontSize: '18px',
    color: '#fff',
    fontWeight: 'bold',
  },
  moduleDescription: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  menuButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255,255,255,.05)',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '6px',
    transition: 'all .3s ease',
  },
  subMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    paddingLeft: '15px',
    marginBottom: '10px',
  },
  subMenuButton: {
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(255,255,255,.03)',
    color: '#cbd5e1',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all .3s ease',
  },
}

export default Dashboard