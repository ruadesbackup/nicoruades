import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient, getApiErrorMessage } from '../../../shared/services/apiClient'
import { setToken } from '../../../shared/services/auth'

function LoginAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const resp = await apiClient.post('/auth/login', { email, password })
      const { token } = resp.data
      setToken(token)
      navigate('/admin')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="login-admin-page">
      <h3>Ingresar al panel</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <button className="btn btn-primary" type="submit">Ingresar</button>
      </form>
    </div>
  )
}

export default LoginAdminPage
