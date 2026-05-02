import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient, getApiErrorMessage } from '../../../shared/services/apiClient'
import { setToken } from '../../../shared/services/auth'

function LoginAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  const navigate = useNavigate()

  // ✅ detectar sesión expirada
  useEffect(() => {
    const expired = localStorage.getItem('session_expired')

    if (expired) {
      setSessionExpired(true)
      localStorage.removeItem('session_expired')
    }
  }, [])

  // ✅ login
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    try {
      const resp = await apiClient.post('/auth/login', { email, password })
      const { token } = resp.data

      setToken(token)

      // 🔥 REDIRECCIÓN CORRECTA
      navigate('/admin', { replace: true })

    } catch (err) {
      if (err.response?.status === 401) {
      setError('Email o contraseña incorrectos')
    } else {
      setError('Error al iniciar sesión. Intentalo de nuevo.')
    }
    }
  }

  return (
    <div className="login-admin-page">
  <div className="login-card">

    <div className="login-header">
      <h3>Ingresar al panel</h3>
      <p>Acceso administrativo</p>
    </div>

    {sessionExpired && (
      <div className="alert-warning">
        Sesión expirada. Volvé a iniciar sesión.
      </div>
    )}

    <form onSubmit={handleSubmit} className="login-form">

      <div className="form-block">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-block">
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <button className="btn-gold" type="submit">
        Ingresar
      </button>

    </form>

  </div>
</div>
  )
}

export default LoginAdminPage
