import { useEffect, useMemo, useState } from 'react'
import {
  createCarouselItem,
  deleteCarouselItem,
  listCarouselItems,
  updateCarouselItem,
} from '../services/carouselService'
import { getApiErrorMessage } from '../../../../shared/services/apiClient'
import { listNews } from '../../news/services/newsService'

function createInitialForm() {
  return {
    display_order: '0',
    news_id: '',
    img_desktop_file: null,
    img_mobile_file: null,
  }
}

function toSafeOrder(value) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 0) {
    return 0
  }

  return parsed
}

function toSafeNewsId(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

export function useCarouselAdmin() {
  const [items, setItems] = useState([])
  const [newsOptions, setNewsOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [form, setForm] = useState(createInitialForm)
  const [editingId, setEditingId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [reordering, setReordering] = useState(false)
  const [removingMediaKey, setRemovingMediaKey] = useState('')

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.display_order - b.display_order) || (a.carousel_id - b.carousel_id)),
    [items],
  )

  const newsTitleById = useMemo(() => {
    return new Map(newsOptions.map((item) => [item.news_id, item.title]))
  }, [newsOptions])

  useEffect(() => {
    let active = true

    async function fetchData() {
      setLoading(true)
      setError('')

      try {
        const [carouselResponse, newsResponse] = await Promise.all([
          listCarouselItems(),
          listNews({ page: 1, limit: 300 }),
        ])

        if (!active) {
          return
        }

        setItems(carouselResponse.data || [])
        setNewsOptions(newsResponse.data || [])
      } catch (requestError) {
        if (active) {
          setError(getApiErrorMessage(requestError))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void fetchData()

    return () => {
      active = false
    }
  }, [refreshIndex])

  function requestRefresh() {
    setRefreshIndex((currentValue) => currentValue + 1)
  }

  function startCreate() {
    setEditingId(null)
    setEditingItem(null)
    setForm(createInitialForm())
    setError('')
    setNotice('')
  }

  function startEdit(item) {
    setEditingId(item.carousel_id)
    setEditingItem(item)
    setForm({
      display_order: String(item.display_order ?? 0),
      news_id: item.news_id ? String(item.news_id) : '',
      img_desktop_file: null,
      img_mobile_file: null,
    })
    setError('')
    setNotice('')
  }

  function updateFormField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    const payload = {
      display_order: toSafeOrder(form.display_order),
      news_id: toSafeNewsId(form.news_id),
      img_desktop_file: form.img_desktop_file,
      img_mobile_file: form.img_mobile_file,
    }

    try {
      if (editingId) {
        await updateCarouselItem(editingId, payload)
        setNotice('El banner se actualizó correctamente.')
      } else {
        await createCarouselItem(payload)
        setNotice('El banner se creó correctamente.')
      }

      setForm(createInitialForm())
      setEditingId(null)
      setEditingItem(null)
      requestRefresh()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(item) {
    const accepted = window.confirm(
      `Eliminar el banner #${item.carousel_id}? Esta acción no se puede deshacer.`,
    )

    if (!accepted) {
      return
    }

    setDeletingId(item.carousel_id)
    setError('')
    setNotice('')

    try {
      await deleteCarouselItem(item.carousel_id)
      setNotice('El banner se eliminó correctamente.')
      requestRefresh()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setDeletingId(null)
    }
  }

  async function persistOrderChange(firstItem, secondItem) {
    await updateCarouselItem(firstItem.carousel_id, {
      display_order: secondItem.display_order,
      news_id: firstItem.news_id,
      img_desktop_file: null,
      img_mobile_file: null,
    })

    await updateCarouselItem(secondItem.carousel_id, {
      display_order: firstItem.display_order,
      news_id: secondItem.news_id,
      img_desktop_file: null,
      img_mobile_file: null,
    })
  }

  async function moveItem(item, direction) {
    const currentIndex = sortedItems.findIndex((entry) => entry.carousel_id === item.carousel_id)

    if (currentIndex === -1) {
      return
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= sortedItems.length) {
      return
    }

    const targetItem = sortedItems[targetIndex]

    setReordering(true)
    setError('')
    setNotice('')

    try {
      await persistOrderChange(item, targetItem)
      setNotice('Orden de banners actualizado.')
      requestRefresh()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setReordering(false)
    }
  }

  async function handleRemoveMedia(item, mediaType) {
    const mediaLabel = mediaType === 'desktop' ? 'desktop' : 'mobile'
    const mediaKey = `${mediaType}-${item.carousel_id}`

    const accepted = window.confirm(
      `Quitar solo la imagen ${mediaLabel} del banner #${item.carousel_id}?`,
    )

    if (!accepted) {
      return
    }

    setRemovingMediaKey(mediaKey)
    setError('')
    setNotice('')

    try {
      await updateCarouselItem(item.carousel_id, {
        display_order: item.display_order,
        news_id: item.news_id,
        img_desktop_file: null,
        img_mobile_file: null,
        remove_img_desktop: mediaType === 'desktop',
        remove_img_mobile: mediaType === 'mobile',
      })

      setNotice(`Imagen ${mediaLabel} eliminada correctamente.`)

      if (editingId === item.carousel_id) {
        setEditingItem((current) => {
          if (!current) {
            return current
          }

          return {
            ...current,
            img_desktop: mediaType === 'desktop' ? null : current.img_desktop,
            img_mobile: mediaType === 'mobile' ? null : current.img_mobile,
          }
        })
      }

      requestRefresh()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setRemovingMediaKey('')
    }
  }

  return {
    items: sortedItems,
    newsOptions,
    newsTitleById,
    loading,
    saving,
    deletingId,
    form,
    editingId,
    editingItem,
    error,
    notice,
    startCreate,
    startEdit,
    updateFormField,
    handleSubmit,
    handleDelete,
    moveItem,
    reordering,
    handleRemoveMedia,
    removingMediaKey,
  }
}
