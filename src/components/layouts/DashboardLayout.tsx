import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
  headerProps?: {
    title?: string
    subtitle?: string
    userName?: string
    userRole?: string
    avatarUrl?: string
    currentModule?: string
  }
  selectedModule?: string
  onSelectModule?: (moduleId: string) => void
}

export const DashboardLayout = ({ 
  children, 
  headerProps,
  selectedModule,
  onSelectModule 
}: DashboardLayoutProps) => {
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#020617,#0f172a,#1e293b)',
      position: 'relative' as const,
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
    },
    overlay: {
      position: 'absolute' as const,
      inset: 0,
      background:
        'radial-gradient(circle at top left, rgba(59,130,246,.25), transparent 30%), ' +
        'radial-gradient(circle at bottom right, rgba(168,85,247,.25), transparent 30%)',
      filter: 'blur(40px)',
    },
    content: {
      position: 'relative' as const,
      zIndex: 1,
      display: 'flex',
      minHeight: '100vh',
    },
    main: {
      flex: 1,
      padding: '40px',
      color: '#fff',
      overflowY: 'auto' as const,
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      
      <div style={styles.content}>
        <Sidebar 
          selectedModule={selectedModule} 
          onSelectModule={onSelectModule} 
        />
        
        <main style={styles.main}>
          <Header {...headerProps} />
          {children}
        </main>
      </div>
    </div>
  )
}