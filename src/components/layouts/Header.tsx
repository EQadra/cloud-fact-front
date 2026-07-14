interface HeaderProps {
  title?: string
  subtitle?: string
  userName?: string
  userRole?: string
  avatarUrl?: string
  currentModule?: string
}

export const Header = ({
  title = 'Bienvenido al Panel',
  subtitle = 'Sistema de Gestión y Control de Seguridad',
  userName = 'Admin',
  userRole = 'Administrador',
  avatarUrl = 'https://i.pravatar.cc/100',
  currentModule,
}: HeaderProps) => {
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '35px',
      flexWrap: 'wrap' as const,
      gap: '20px',
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    title: {
      margin: 0,
      fontSize: '32px',
      background: 'linear-gradient(135deg,#60a5fa,#a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      color: '#cbd5e1',
      margin: 0,
      fontSize: '14px',
    },
    profile: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      padding: '8px 18px 8px 8px',
      borderRadius: '50px',
      backdropFilter: 'blur(12px)',
    },
    profileImage: {
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,.2)',
    },
    profileInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    profileName: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#fff',
    },
    profileRole: {
      color: '#94a3b8',
      fontSize: '12px',
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#94a3b8',
    },
    breadcrumbActive: {
      color: '#60a5fa',
    },
  }

  return (
    <header style={styles.header}>
      <div style={styles.titleContainer}>
        <div style={styles.breadcrumb}>
          <span style={{ cursor: 'pointer' }}>Dashboard</span>
          {currentModule && (
            <>
              <span>/</span>
              <span style={styles.breadcrumbActive}>{currentModule}</span>
            </>
          )}
        </div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>

      <div style={styles.profile}>
        <img src={avatarUrl} alt={userName} style={styles.profileImage} />
        <div style={styles.profileInfo}>
          <h3 style={styles.profileName}>{userName}</h3>
          <span style={styles.profileRole}>{userRole}</span>
        </div>
      </div>
    </header>
  )
}