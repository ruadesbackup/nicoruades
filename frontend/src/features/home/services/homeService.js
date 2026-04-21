import { apiClient } from '../../../shared/services/apiClient'

export async function listHomeCarousel() {
  const response = await apiClient.get('/carousel')
  return response.data
}

export async function listPublicReviews() {
  const response = await apiClient.get('/google-reviews/public')
  return response.data
}
