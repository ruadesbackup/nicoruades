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

// Manejo de errores
export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo completar la solicitud.'
}