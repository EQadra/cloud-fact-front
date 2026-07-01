// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FaGoogle,
  FaFacebookF,
  FaGithub,
} from 'react-icons/fa'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] =
    useState(false)

  const handleLogin = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    // Login temporal
    if (user === 'admin' && password === '1234') {
      login()

      navigate('/dashboard')
    } else {
      alert('Credenciales incorrectas')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <form
          onSubmit={handleLogin}
          style={styles.form}
        >
          <div style={styles.header}>
            <h1 style={styles.title}>
              Bienvenido
            </h1>

            <p style={styles.subtitle}>
              Inicia sesión para continuar
            </p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Usuario
            </label>

            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={user}
              onChange={(e) =>
                setUser(e.target.value)
              }
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={styles.input}
            />
          </div>

          <div style={styles.options}>
            <label style={styles.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
              />

              <span>Recordarme</span>
            </label>

            <span style={styles.forgot}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <button
            type="submit"
            style={styles.button}
          >
            Ingresar
          </button>

          <div style={styles.divider}>
            <span>o continúa con</span>
          </div>

          <div style={styles.socials}>
            <button
              type="button"
              style={styles.socialButton}
            >
              <FaGoogle />
            </button>

            <button
              type="button"
              style={styles.socialButton}
            >
              <FaFacebookF />
            </button>

            <button
              type="button"
              style={styles.socialButton}
            >
              <FaGithub />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles: {
  [key: string]: React.CSSProperties
} = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background:
      'linear-gradient(135deg, #0f172a, #1e293b)',
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
    boxShadow:
      '0 10px 30px rgba(0,0,0,0.3)',
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
  },

  button: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background:
      'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow:
      '0 4px 15px rgba(37,99,235,0.4)',
  },

  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1',
    fontSize: '13px',
    marginTop: '10px',
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
}

export default Login