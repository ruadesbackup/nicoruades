import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo completar la solicitud.'
}