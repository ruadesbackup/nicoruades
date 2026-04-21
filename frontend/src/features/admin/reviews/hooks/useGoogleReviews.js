import { useEffect, useState } from 'react'
import {
  createGoogleReview,
  deleteGoogleReview,
  listGoogleReviews,
  updateGoogleReview,
  updateGoogleReviewVisibility,
} from '../services/googleReviewsService'
import { getApiErrorMessage } from '../../../../shared/services/apiClient'

const initialFilters = {
  author_name: '',
  rating: '',
}

function toDatetimeLocal(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function createInitialForm() {
  return {
    author_name: '',
    content: '',
    rating: '5',
    review_url: '',
    profile_photo_url: '',
    review_date: toDatetimeLocal(new Date()),
    is_visible: true,
  }
}

function toIsoDate(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString()
}

export function useGoogleReviews() {
  const [reviews, setReviews] = useState([])
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
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    let active = true

    async function fetchReviews() {
      setLoading(true)
      setError('')

      try {
        const response = await listGoogleReviews({
          page,
          limit,
          author_name: filters.author_name,
          rating: filters.rating,
        })

        if (!active) {
          return
        }

        setReviews(response.data || [])
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

    void fetchReviews()

    return () => {
      active = false
    }
  }, [page, filters, refreshIndex])

  function requestRefresh() {
    setRefreshIndex((currentValue) => currentValue + 1)
  }

  function startCreate() {
    setEditingId(null)
    setForm(createInitialForm())
    setNotice('')
    setError('')
  }

  function startEdit(review) {
    setEditingId(review.review_id)
    setForm({
      author_name: review.author_name || '',
      content: review.content || '',
      rating: String(review.rating || 5),
      review_url: review.review_url || '',
      profile_photo_url: review.profile_photo_url || '',
      review_date: toDatetimeLocal(review.review_date),
      is_visible: Boolean(review.is_visible),
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

    const payload = {
      author_name: form.author_name.trim(),
      content: form.content.trim() || null,
      rating: Number(form.rating),
      review_url: form.review_url.trim(),
      profile_photo_url: form.profile_photo_url.trim() || null,
      review_date: toIsoDate(form.review_date),
      is_visible: form.is_visible,
    }

    try {
      if (editingId) {
        await updateGoogleReview(editingId, payload)
        setNotice('La reseña se actualizó correctamente.')
      } else {
        await createGoogleReview(payload)
        setNotice('La reseña se creó correctamente.')
        setPage(1)
      }

      setForm(createInitialForm())
      setEditingId(null)
      requestRefresh()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleVisibility(review) {
    setError('')
    setNotice('')

    try {
      const response = await updateGoogleReviewVisibility(review.review_id, !review.is_visible)
      const updatedReview = response?.data

      if (updatedReview) {
        setReviews((current) =>
          current.map((item) => (item.review_id === updatedReview.review_id ? updatedReview : item)),
        )
      } else {
        requestRefresh()
      }

      setNotice(
        review.is_visible ? 'La reseña quedó oculta.' : 'La reseña volvió a estar visible.',
      )
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    }
  }

  async function handleDelete(review) {
    const accepted = window.confirm(
      `Eliminar la reseña de ${review.author_name}? Esta acción no se puede deshacer.`,
    )

    if (!accepted) {
      return
    }

    setDeletingId(review.review_id)
    setError('')
    setNotice('')

    try {
      await deleteGoogleReview(review.review_id)
      setNotice('La reseña se eliminó correctamente.')

      if (reviews.length === 1 && page > 1) {
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
    reviews,
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
    error,
    notice,
    startCreate,
    startEdit,
    updateFormField,
    updateFilterField,
    handleSubmit,
    handleToggleVisibility,
    handleDelete,
  }
}