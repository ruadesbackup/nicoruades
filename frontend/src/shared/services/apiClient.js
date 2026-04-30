import axios from 'axios'
import { getToken } from './auth'

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Agregar interceptor para enviar token si existe
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo completar la solicitud.'
}