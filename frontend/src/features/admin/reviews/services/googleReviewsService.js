import { apiClient } from '../../../../shared/services/apiClient'

const RESOURCE = '/google-reviews'

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

export async function listGoogleReviews(params = {}) {
  const response = await apiClient.get(RESOURCE, { params: cleanParams(params) })
  return response.data
}

export async function getGoogleReviewById(id) {
  const response = await apiClient.get(`${RESOURCE}/${id}`)
  return response.data
}

export async function createGoogleReview(payload) {
  const response = await apiClient.post(RESOURCE, payload)
  return response.data
}

export async function updateGoogleReview(id, payload) {
  const response = await apiClient.put(`${RESOURCE}/${id}`, payload)
  return response.data
}

export async function updateGoogleReviewVisibility(id, is_visible) {
  const response = await apiClient.patch(`${RESOURCE}/${id}/visibility`, { is_visible })
  return response.data
}

export async function deleteGoogleReview(id) {
  const response = await apiClient.delete(`${RESOURCE}/${id}`)
  return response.data
}