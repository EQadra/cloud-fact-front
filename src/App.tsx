import AppRouter from './routes'

function App() {
  return (
    <div style={styles.app}>
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>

      <AppRouter />
    </div>
  )
}

const styles: {
  [key: string]: React.CSSProperties
} = {
  app: {
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    background:
      'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)',
  },

  circle1: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background:
      'rgba(59, 130, 246, 0.25)',
    top: '-100px',
    left: '-100px',
    filter: 'blur(120px)',
  },

  circle2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background:
      'rgba(168, 85, 247, 0.25)',
    bottom: '-80px',
    right: '-80px',
    filter: 'blur(120px)',
  },
}

export default App