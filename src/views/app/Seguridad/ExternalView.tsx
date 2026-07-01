// src/views/app/Seguridad/ExternalView.jsx
// @ts-nocheck
import { useState } from 'react';
import { 
  FaGlobe, 
  FaExpand, 
  FaCompress, 
  FaSync, 
  FaShieldAlt,
  FaVideo,
  FaCamera,
  FaLock,
  FaDesktop,
  FaExternalLinkAlt,
  // FaSpinner
} from 'react-icons/fa';

export default function ExternalView() {
  // URL por defecto - Google Maps (formato embed correcto)
  const [url, setUrl] = useState(
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.929750884718!2d-77.040689!3d-12.046374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5c6f2b4c8e5%3A0x3d7c5f8c7e2a8b4c!2sLima%2C%20Peru!5e0!3m2!1sen!2spe!4v1625000000000'
  );
  const [inputUrl, setInputUrl] = useState(url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const handleReload = () => {
    setIframeKey(Date.now());
    setIsLoading(true);
    setLoadError(false);
  };

  const handleFullscreen = () => {
    const element = document.getElementById('iframe-container');
    if (!isFullscreen) {
      if (element?.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    setInputUrl(newUrl);
    setIframeKey(Date.now());
    setIsLoading(true);
    setLoadError(false);
  };

  const handleGo = () => {
    setUrl(inputUrl);
    setIframeKey(Date.now());
    setIsLoading(true);
    setLoadError(false);
  };

  // URLs rápidas que funcionan en iframe (formato embed correcto)
  const quickUrls = [
    { name: '🗺️ Google Maps', url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.929750884718!2d-77.040689!3d-12.046374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5c6f2b4c8e5%3A0x3d7c5f8c7e2a8b4c!2sLima%2C%20Peru!5e0!3m2!1sen!2spe!4v1625000000000' },
    { name: '📹 YouTube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { name: '📊 Dashboard', url: 'https://demo.nosqlclient.com/app/statistics' },
    { name: '🌐 Cloudflare', url: 'https://status.cloudflare.com/' },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#020617,#0f172a,#1e293b)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Arial,sans-serif',
      padding: '30px',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at top left, rgba(59,130,246,.25), transparent 30%), radial-gradient(circle at bottom right, rgba(168,85,247,.25), transparent 30%)',
      filter: 'blur(40px)',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      color: '#fff',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '20px',
    },
    title: {
      margin: 0,
      fontSize: '32px',
      background: 'linear-gradient(135deg,#60a5fa,#a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      color: '#cbd5e1',
      marginTop: '8px',
    },
    card: {
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: '18px',
      padding: '20px',
      backdropFilter: 'blur(12px)',
      marginBottom: '20px',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,.12)',
      background: 'rgba(255,255,255,.05)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
    },
    button: {
      padding: '12px 20px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all .3s ease',
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
      color: '#fff',
    },
    buttonSecondary: {
      background: 'rgba(255,255,255,.08)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,.1)',
    },
    iframeWrapper: {
      width: '100%',
      maxWidth: '1024px',
      height: '600px',
      overflow: 'hidden',
      backgroundColor: '#0a0a0a',
      borderRadius: '18px',
      border: '1px solid rgba(255,255,255,.1)',
      margin: '0 auto',
      position: 'relative',
    },
    infoBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '15px 20px',
      background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
      pointerEvents: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
    },
    badge: {
      padding: '6px 14px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    badgeSuccess: {
      background: 'rgba(34,197,94,.2)',
      color: '#22c55e',
    },
    badgeInfo: {
      background: 'rgba(59,130,246,.2)',
      color: '#60a5fa',
    },
    badgeLight: {
      background: 'rgba(255,255,255,.1)',
      color: '#fff',
    },
    badgeDanger: {
      background: 'rgba(239,68,68,.2)',
      color: '#ef4444',
    },
    alert: {
      padding: '12px 18px',
      borderRadius: '12px',
      background: 'rgba(245,158,11,.1)',
      border: '1px solid rgba(245,158,11,.2)',
      color: '#f59e0b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '20px',
      fontSize: '14px',
    },
    alertError: {
      padding: '12px 18px',
      borderRadius: '12px',
      background: 'rgba(239,68,68,.1)',
      border: '1px solid rgba(239,68,68,.2)',
      color: '#ef4444',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '20px',
      fontSize: '14px',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      zIndex: 10,
    },
    spinner: {
      width: '3rem',
      height: '3rem',
      border: '4px solid rgba(255,255,255,.1)',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto',
    },
    infoBadges: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '15px',
    },
    quickButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '10px',
    },
    quickButton: {
      padding: '8px 16px',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,.1)',
      background: 'rgba(255,255,255,.05)',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '13px',
      transition: 'all .3s ease',
    },
    quickButtonActive: {
      background: 'rgba(59,130,246,.2)',
      border: '1px solid #3b82f6',
      color: '#60a5fa',
    },
    inputGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      flex: 1,
    },
    inputWrapper: {
      flex: 1,
      minWidth: '200px',
      display: 'flex',
      background: 'rgba(255,255,255,.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,.12)',
      overflow: 'hidden',
    },
    inputIcon: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      color: '#94a3b8',
    },
    urlInput: {
      flex: 1,
      padding: '12px 16px',
      background: 'transparent',
      border: 'none',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      backgroundColor: '#000',
      display: 'block',
    },
    iframeHidden: {
      display: 'none',
    },
  };

  const getUrlType = (url) => {
    if (url.includes('google.com/maps/embed')) return 'Google Maps';
    if (url.includes('youtube.com/embed')) return 'YouTube';
    if (url.includes('cloudflare')) return 'Cloudflare';
    if (url.includes('nosqlclient')) return 'Dashboard';
    return 'URL personalizada';
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <FaVideo style={{ marginRight: '10px', color: '#60a5fa' }} />
              Visor Externo
            </h1>
            <p style={styles.subtitle}>Visualización de sistemas externos y monitoreo en tiempo real</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={handleReload}>
              <FaSync />
              Recargar
            </button>
            <button style={{ ...styles.button, ...styles.buttonPrimary }} onClick={handleFullscreen}>
              {isFullscreen ? <FaCompress /> : <FaExpand />}
              {isFullscreen ? 'Salir' : 'Pantalla completa'}
            </button>
          </div>
        </div>

        {/* Control de URL */}
        <div style={styles.card}>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <FaLock style={{ color: '#94a3b8' }} />
              </div>
              <input
                type="url"
                style={styles.urlInput}
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Ingresa una URL (ej: https://www.youtube.com/embed/...) "
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGo();
                  }
                }}
              />
            </div>
            <button 
              style={{ ...styles.button, ...styles.buttonPrimary }} 
              onClick={handleGo}
            >
              <FaGlobe />
              Ir
            </button>
            <button 
              style={{ ...styles.button, ...styles.buttonSecondary }}
              onClick={() => window.open(url, '_blank')}
            >
              <FaExternalLinkAlt />
              Abrir en ventana
            </button>
          </div>
          
          {/* Accesos rápidos */}
          <div style={styles.quickButtons}>
            {quickUrls.map((item) => (
              <button
                key={item.name}
                style={{
                  ...styles.quickButton,
                  ...(url === item.url ? styles.quickButtonActive : {})
                }}
                onClick={() => handleUrlChange(item.url)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Iframe */}
        <div id="iframe-container" style={styles.iframeWrapper}>
          {isLoading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner}></div>
              <p style={{ marginTop: '15px', color: 'rgba(255,255,255,0.5)' }}>Cargando contenido...</p>
            </div>
          )}
          
          <iframe
            key={iframeKey}
            src={url}
            style={{
              ...styles.iframe,
              ...(isLoading ? styles.iframeHidden : {})
            }}
            title="Visor externo"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
            loading="lazy"
            onLoad={() => {
              setIsLoading(false);
              setLoadError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setLoadError(true);
            }}
            allow="camera; microphone; fullscreen; geolocation; autoplay; encrypted-media"
          />

          <div style={styles.infoBar}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ ...styles.badge, ...styles.badgeSuccess }}>
                <FaShieldAlt />
                Seguro
              </span>
              <span style={{ ...styles.badge, ...(loadError ? styles.badgeDanger : styles.badgeSuccess) }}>
                <span style={{ fontSize: '8px' }}>{loadError ? '✕' : '●'}</span>
                {loadError ? 'Error' : 'En vivo'}
              </span>
              <span style={{ ...styles.badge, ...styles.badgeInfo }}>
                <FaVideo />
                {getUrlType(url)}
              </span>
            </div>
            <span style={{ 
              color: 'rgba(255,255,255,0.4)',
              fontSize: '12px',
              maxWidth: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {url}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div style={styles.infoBadges}>
          <span style={{ ...styles.badge, ...styles.badgeLight }}>
            <FaDesktop />
            Tamaño: 1024 x 600 px
          </span>
          <span style={{ ...styles.badge, ...styles.badgeInfo }}>
            <FaGlobe />
            {getUrlType(url)}
          </span>
          <span style={{ ...styles.badge, ...(loadError ? styles.badgeDanger : styles.badgeLight) }}>
            <FaCamera />
            {loadError ? 'Error de carga' : (isLoading ? 'Cargando...' : 'Conectado')}
          </span>
        </div>

        {/* Nota de error */}
        {loadError && (
          <div style={styles.alertError}>
            <FaShieldAlt />
            <div>
              <strong>Error:</strong> No se pudo cargar el contenido. 
              Algunos sitios bloquean los iframes por seguridad. 
              Usa el botón <strong>"Abrir en ventana"</strong> para ver el contenido.
            </div>
          </div>
        )}

        {/* Nota informativa */}
        <div style={styles.alert}>
          <FaShieldAlt />
          <div>
            <strong>Nota:</strong> Para ver contenido de EZVIZ u otras cámaras de seguridad, 
            usa el botón <strong>"Abrir en ventana"</strong> ya que estos sitios suelen bloquear los iframes.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}