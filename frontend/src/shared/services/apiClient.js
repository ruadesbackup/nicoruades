import axios from 'axios'
import { getToken } from './auth'

// Base URL consistente (siempre con /api)
const baseURL =
  (import.meta.env.VITE_API_URL || 'http://localhost:3000')
    .replace(/\/$/, '') + '/api'

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // guardamos mensaje para mostrarlo en login
      localStorage.setItem('session_expired', 'true')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Manejo de errores
export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo completar la solicitud.'
}