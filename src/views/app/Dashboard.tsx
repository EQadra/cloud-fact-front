import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DashboardLayout } from '../../components/layouts/DashboardLayout'
import { modulesConfig } from '../../config/modules.config'
import { FaArrowLeft } from 'react-icons/fa'

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  // ✅ Leer el estado de la URL (solo para mantener sincronía)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const moduleParam = params.get('module')
    if (moduleParam && modulesConfig.find(m => m.id === moduleParam)) {
      setSelectedModule(moduleParam)
    } else if (location.pathname === '/dashboard' && !moduleParam) {
      setSelectedModule(null)
    }
  }, [location.search, location.pathname])

  const currentModule = selectedModule 
    ? modulesConfig.find(m => m.id === selectedModule)
    : null

  const styles = {
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '40px',
    },
    statCard: {
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: '18px',
      padding: '25px',
      backdropFilter: 'blur(12px)',
      transition: 'all .3s ease',
    },
    statLabel: {
      color: '#94a3b8',
      fontSize: '14px',
    },
    statValue: {
      fontSize: '32px',
      margin: '8px 0 0 0',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    modulesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '22px',
    },
    moduleCard: {
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '25px',
      minHeight: '140px',
      display: 'flex',
      flexDirection: 'column' as const,
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
      fontSize: '13px',
      color: '#94a3b8',
    },
    subModuleCard: {
      background: 'rgba(255,255,255,.05)',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: '16px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all .3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    subModuleIcon: {
      fontSize: '28px',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,.05)',
      borderRadius: '12px',
    },
    subModuleInfo: {
      flex: 1,
    },
    subModuleTitle: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      margin: 0,
    },
    subModuleDescription: {
      color: '#94a3b8',
      fontSize: '13px',
      margin: '4px 0 0 0',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255,255,255,.05)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: '12px',
      padding: '10px 18px',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all .3s ease',
      marginBottom: '25px',
    },
    sectionTitle: {
      fontSize: '24px',
      margin: '0 0 8px 0',
      color: '#fff',
    },
    sectionSubtitle: {
      color: '#94a3b8',
      margin: '0 0 25px 0',
      fontSize: '15px',
    },
    subModulesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
    },
  }

  // ============================================================
  // RENDER DASHBOARD PRINCIPAL
  // ============================================================
  const renderDashboardContent = () => (
    <>
      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Registros Vehículos</span>
          <h2 style={styles.statValue}>1,254</h2>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Registros Peatonales</span>
          <h2 style={styles.statValue}>3,521</h2>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Incidentes</span>
          <h2 style={styles.statValue}>42</h2>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Usuarios Activos</span>
          <h2 style={styles.statValue}>18</h2>
        </div>
      </div>

      {/* Módulos */}
      <div style={styles.modulesGrid}>
        {modulesConfig.map((module) => {
          const Icon = module.icon
          const colors = ['#3b82f6', '#22c55e', '#8b5cf6']
          const color = colors[modulesConfig.indexOf(module) % colors.length]
          
          return (
            <div
              key={module.id}
              style={{
                ...styles.moduleCard,
                borderLeft: `4px solid ${color}`,
              }}
              onClick={() => {
                setSelectedModule(module.id)
                navigate(`/dashboard?module=${module.id}`)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,.25)'
              }}
            >
              <div style={{ ...styles.moduleIcon, color }}>
                <Icon />
              </div>
              <span style={styles.moduleTitle}>{module.title}</span>
              <span style={styles.moduleDescription}>
                {module.description} • {module.subModules.length} submódulos
              </span>
            </div>
          )
        })}
      </div>
    </>
  )

  // ============================================================
  // RENDER SUBMÓDULOS DE UN MÓDULO
  // ============================================================
  const renderModuleContent = () => {
    if (!currentModule) return null

    const Icon = currentModule.icon
    const colors = ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b']

    return (
      <>
        {/* Botón Volver */}
        <button
          style={styles.backButton}
          onClick={() => {
            setSelectedModule(null)
            navigate('/dashboard')
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,.05)'
          }}
        >
          <FaArrowLeft />
          Volver al Dashboard
        </button>

        {/* Título del Módulo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ fontSize: '36px', color: '#60a5fa' }}>
            <Icon />
          </div>
          <h2 style={styles.sectionTitle}>{currentModule.title}</h2>
        </div>
        <p style={styles.sectionSubtitle}>{currentModule.description}</p>

        {/* Submódulos como tarjetas */}
        <div style={styles.subModulesGrid}>
          {currentModule.subModules.map((sub, index) => {
            const SubIcon = sub.icon
            const color = colors[index % colors.length]
            return (
              <div
                key={sub.id}
                style={styles.subModuleCard}
                onClick={() => navigate(sub.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,.1)'
                  e.currentTarget.style.transform = 'translateX(5px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,.05)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div style={{ ...styles.subModuleIcon, color }}>
                  <SubIcon />
                </div>
                <div style={styles.subModuleInfo}>
                  <h3 style={styles.subModuleTitle}>{sub.label}</h3>
                  <p style={styles.subModuleDescription}>{sub.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  // ============================================================
  // DECIDIR QUÉ RENDERIZAR
  // ============================================================
  const isDashboard = !selectedModule || location.pathname !== '/dashboard'

  // Si estamos en una ruta de submódulo (ej: /seguridad/access-car), mostramos el DashboardLayout con el módulo seleccionado
  // Pero el contenido lo decide el renderizado condicional

  const headerTitle = isDashboard 
    ? 'Bienvenido al Panel' 
    : currentModule?.title || 'Módulo'

  const headerSubtitle = isDashboard
    ? 'Sistema de Gestión y Control de Seguridad'
    : currentModule?.description || ''

  return (
    <DashboardLayout
      headerProps={{
        title: headerTitle,
        subtitle: headerSubtitle,
        currentModule: isDashboard ? undefined : currentModule?.title,
      }}
      selectedModule={selectedModule || undefined}
      onSelectModule={(moduleId) => {
        setSelectedModule(moduleId)
        if (moduleId) {
          navigate(`/dashboard?module=${moduleId}`)
        } else {
          navigate('/dashboard')
        }
      }}
    >
      {isDashboard ? renderDashboardContent() : renderModuleContent()}
    </DashboardLayout>
  )
}

export default Dashboard