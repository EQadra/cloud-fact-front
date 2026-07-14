// src/views/auth/Login.tsx
// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaGoogle,
  FaFacebookF,
  FaGithub,
  FaSpinner,
} from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showError, setShowError] = useState('');

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Mostrar errores del contexto
  useEffect(() => {
    if (error) {
      setShowError(error);
      const timer = setTimeout(() => {
        setShowError('');
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowError('');

    // Validaciones básicas
    if (!email.trim()) {
      setShowError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!password.trim()) {
      setShowError('Por favor ingresa tu contraseña');
      return;
    }

    try {
      await login(email, password);
      
      // Si el login es exitoso, el useEffect de isAuthenticated redirigirá
      // Pero por si acaso, redirigimos manualmente
      navigate('/dashboard');
    } catch (err) {
      // El error ya se maneja en el contexto
      console.error('Login error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.header}>
            <h1 style={styles.title}>Bienvenido</h1>
            <p style={styles.subtitle}>Inicia sesión para continuar</p>
          </div>

          {/* Mensaje de error */}
          {showError && (
            <div style={styles.errorMessage}>
              <span>❌ {showError}</span>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@cloudfact.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.options}>
            <label style={styles.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <span>Recordarme</span>
            </label>
            <span style={styles.forgot}>¿Olvidaste tu contraseña?</span>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: '10px' }} />
                Iniciando sesión...
              </>
            ) : (
              'Ingresar'
            )}
          </button>

          <div style={styles.divider}>
            <span>o continúa con</span>
          </div>

          <div style={styles.socials}>
            <button type="button" style={styles.socialButton} disabled={loading}>
              <FaGoogle />
            </button>
            <button type="button" style={styles.socialButton} disabled={loading}>
              <FaFacebookF />
            </button>
            <button type="button" style={styles.socialButton} disabled={loading}>
              <FaGithub />
            </button>
          </div>

          {/* Estado de conexión */}
          <div style={styles.footer}>
            <span style={styles.footerText}>
              {loading ? 'Conectando...' : '✅ Conectado al servidor'}
            </span>
          </div>
        </form>
      </div>

      {/* Animación de spin */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    fontFamily: 'Arial, sans-serif',
  },

  overlay: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },

  form: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },

  header: {
    textAlign: 'center',
  },

  title: {
    color: '#fff',
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#cbd5e1',
    marginTop: '8px',
    fontSize: '14px',
  },

  errorMessage: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    color: '#e2e8f0',
    fontSize: '14px',
  },

  input: {
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },

  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#cbd5e1',
    fontSize: '13px',
  },

  remember: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },

  forgot: {
    cursor: 'pointer',
    color: '#60a5fa',
    ':hover': {
      color: '#3b82f6',
    },
  },

  button: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 15px rgba(37,99,235,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1',
    fontSize: '13px',
    marginTop: '10px',
    position: 'relative',
  },

  socials: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },

  socialButton: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    transition: '0.3s',
  },

  footer: {
    textAlign: 'center',
    marginTop: '10px',
  },

  footerText: {
    color: '#64748b',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
};

export default Login;