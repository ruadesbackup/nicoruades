import { apiClient } from '../../../../shared/services/apiClient'

const RESOURCE = '/carousel'

function buildCarouselFormData(payload) {
  const formData = new FormData()

  formData.append('display_order', String(payload.display_order ?? 0))

  if (payload.news_id === null || payload.news_id === undefined || payload.news_id === '') {
    formData.append('news_id', '')
  } else {
    formData.append('news_id', String(payload.news_id))
  }

  if (payload.img_desktop_file) {
    formData.append('img_desktop', payload.img_desktop_file)
  }

  if (payload.img_mobile_file) {
    formData.append('img_mobile', payload.img_mobile_file)
  }

  if (payload.remove_img_desktop) {
    formData.append('remove_img_desktop', 'true')
  }

  if (payload.remove_img_mobile) {
    formData.append('remove_img_mobile', 'true')
  }

  return formData
}

export async function listCarouselItems() {
  const response = await apiClient.get(RESOURCE)
  return response.data
}

export async function createCarouselItem(payload) {
  const response = await apiClient.post(RESOURCE, buildCarouselFormData(payload), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export async function updateCarouselItem(id, payload) {
  const response = await apiClient.put(`${RESOURCE}/${id}`, buildCarouselFormData(payload), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export async function deleteCarouselItem(id) {
  const response = await apiClient.delete(`${RESOURCE}/${id}`)
  return response.data
}
