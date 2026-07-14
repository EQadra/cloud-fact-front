import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaSignOutAlt, FaChartLine } from 'react-icons/fa'
import { modulesConfig } from '../../config/modules.config'

interface SidebarProps {
  selectedModule?: string | null
  onSelectModule?: (moduleId: string | null) => void
}

export const Sidebar = ({ selectedModule, onSelectModule }: SidebarProps) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleModuleClick = (moduleId: string) => {
    // ✅ SOLO seleccionar el módulo, NO navegar
    if (onSelectModule) {
      onSelectModule(moduleId)
    }
    // ✅ Navegar al dashboard con el módulo seleccionado
    navigate('/dashboard')
  }

  const handleDashboardClick = () => {
    // ✅ Limpiar selección y navegar al dashboard
    if (onSelectModule) {
      onSelectModule(null)
    }
    navigate('/dashboard')
  }

  const isActive = (moduleId: string) => {
    return selectedModule === moduleId
  }

  const styles = {
    sidebar: {
      width: '260px',
      background: 'rgba(255,255,255,.08)',
      backdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(255,255,255,.1)',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      overflowY: 'auto' as const,
      minHeight: '100vh',
      position: 'sticky' as const,
      top: 0,
    },
    logo: {
      color: '#fff',
      textAlign: 'center' as const,
      marginBottom: '40px',
      fontSize: '24px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    nav: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      border: 'none',
      background: 'transparent',
      color: '#94a3b8',
      cursor: 'pointer',
      width: '100%',
      fontSize: '14px',
      transition: 'all .3s ease',
    },
    navButtonActive: {
      background: 'rgba(96, 165, 250, .15)',
      color: '#60a5fa',
      border: '1px solid rgba(96, 165, 250, .2)',
    },
    moduleButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      border: 'none',
      background: 'transparent',
      color: '#94a3b8',
      cursor: 'pointer',
      width: '100%',
      fontSize: '14px',
      transition: 'all .3s ease',
    },
    moduleButtonActive: {
      background: 'rgba(96, 165, 250, .15)',
      color: '#60a5fa',
      border: '1px solid rgba(96, 165, 250, .2)',
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
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      transition: 'all .3s ease',
      marginTop: '20px',
    },
    badge: {
      marginLeft: 'auto',
      background: 'rgba(96, 165, 250, .15)',
      color: '#60a5fa',
      fontSize: '10px',
      padding: '2px 10px',
      borderRadius: '20px',
    },
  }

  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.logo} onClick={handleDashboardClick}>
          CloudFact
        </h2>

        <nav style={styles.nav}>
          {/* Dashboard principal */}
          <button
            style={{
              ...styles.navButton,
              ...(!selectedModule ? styles.navButtonActive : {})
            }}
            onClick={handleDashboardClick}
            onMouseEnter={(e) => {
              if (selectedModule) {
                e.currentTarget.style.background = 'rgba(255,255,255,.05)'
                e.currentTarget.style.color = '#fff'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedModule) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#94a3b8'
              }
            }}
          >
            <FaChartLine />
            Dashboard
          </button>

          {/* Módulos */}
          {modulesConfig.map((module) => {
            const Icon = module.icon
            const active = isActive(module.id)
            return (
              <button
                key={module.id}
                style={{
                  ...styles.moduleButton,
                  ...(active ? styles.moduleButtonActive : {})
                }}
                onClick={() => handleModuleClick(module.id)}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,.05)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#94a3b8'
                  }
                }}
              >
                <Icon />
                {module.title}
                <span style={styles.badge}>{module.subModules.length}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <button
        style={styles.logoutButton}
        onClick={handleLogout}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(239,68,68,.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <FaSignOutAlt />
        Cerrar sesión
      </button>
    </aside>
  )
}