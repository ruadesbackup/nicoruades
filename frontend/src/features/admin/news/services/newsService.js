import { apiClient } from '../../../../shared/services/apiClient'

const RESOURCE = '/noticias'

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function buildNewsFormData(payload) {
  const formData = new FormData()

  formData.append('title', payload.title ?? '')
  formData.append('content', payload.content ?? '')
  formData.append('youtube_url', payload.youtube_url ?? '')
  formData.append('external_url', payload.external_url ?? '')

  if (payload.img_desktop_file) {
    formData.append('img_desktop', payload.img_desktop_file)
  }

  if (payload.img_mobile_file) {
    formData.append('img_mobile', payload.img_mobile_file)
  }

  return formData
}

export async function listNews(params = {}) {
  const response = await apiClient.get(RESOURCE, { params: cleanParams(params) })
  return response.data
}

export async function createNews(payload) {
  const response = await apiClient.post(RESOURCE, buildNewsFormData(payload), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateNews(id, payload) {
  const response = await apiClient.put(`${RESOURCE}/${id}`, buildNewsFormData(payload), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteNews(id) {
  const response = await apiClient.delete(`${RESOURCE}/${id}`)
  return response.data
}
