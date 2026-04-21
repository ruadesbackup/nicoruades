import { useEffect, useMemo, useState } from 'react'
import { createNews, deleteNews, listNews, updateNews } from '../services/newsService'
import { getApiErrorMessage } from '../../../../shared/services/apiClient'

const initialFilters = {
  search: '',
}

function createInitialForm() {
  return {
    title: '',
    content: '',
    youtube_url: '',
    external_url: '',
    img_desktop_file: null,
    img_mobile_file: null,
  }
}

function buildPayload(form) {
  return {
    title: form.title.trim(),
    content: form.content.trim(),
    youtube_url: form.youtube_url.trim(),
    external_url: form.external_url.trim(),
    img_desktop_file: form.img_desktop_file,
    img_mobile_file: form.img_mobile_file,
  }
}

export function useNewsAdmin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [page, setPage] = useState(1)
  const limit = 8
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState(initialFilters)
  const [form, setForm] = useState(createInitialForm)
  const [editingId, setEditingId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)

  const currentItems = useMemo(() => items || [], [items])

  useEffect(() => {
    let active = true

    async function fetchNews() {
      setLoading(true)
      setError('')

      try {
        const response = await listNews({
          page,
          limit,
          search: filters.search,
        })

        if (!active) {
          return
        }

        setItems(response.data || [])
        setTotal(response.total || 0)
        setTotalPages(response.totalPages || 1)
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

    void fetchNews()

    return () => {
      active = false
    }
  }, [page, filters, refreshIndex])

  function requestRefresh() {
    setRefreshIndex((currentValue) => currentValue + 1)
  }

  function startCreate() {
    setEditingId(null)
    setEditingItem(null)
    setForm(createInitialForm())
    setNotice('')
    setError('')
  }

  function startEdit(item) {
    setEditingId(item.news_id)
    setEditingItem(item)
    setForm({
      title: item.title || '',
      content: item.content || '',
      youtube_url: item.youtube_url || '',
      external_url: item.external_url || '',
      img_desktop_file: null,
      img_mobile_file: null,
    })
    setNotice('')
    setError('')
  }

  function updateFormField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateFilterField(field, value) {
    setPage(1)
    setFilters((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      const payload = buildPayload(form)

      if (editingId) {
        await updateNews(editingId, payload)
        setNotice('La noticia se actualizó correctamente.')
      } else {
        await createNews(payload)
        setNotice('La noticia se creó correctamente.')
        setPage(1)
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
      `Eliminar la noticia "${item.title}"? Esta acción no se puede deshacer.`,
    )

    if (!accepted) {
      return
    }

    setDeletingId(item.news_id)
    setError('')
    setNotice('')

    try {
      await deleteNews(item.news_id)
      setNotice('La noticia se eliminó correctamente.')

      if (currentItems.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1)
      }

      requestRefresh()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setDeletingId(null)
    }
  }

  return {
    items: currentItems,
    loading,
    saving,
    deletingId,
    page,
    setPage,
    total,
    totalPages,
    filters,
    form,
    editingId,
    editingItem,
    error,
    notice,
    startCreate,
    startEdit,
    updateFormField,
    updateFilterField,
    handleSubmit,
    handleDelete,
  }
}
