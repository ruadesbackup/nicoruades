import { useEffect, useMemo } from 'react'
import TipTapEditor from '../components/TipTapEditor'
import { useNewsAdmin } from '../hooks/useNewsAdmin'

function stripHtml(html) {
  return html?.replace(/<[^>]*>?/gm, '') || '';
}

function formatDate(value) {
  if (!value) {
    return 'Sin fecha'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getApiOrigin() {
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')
  return base.replace(/\/api$/, '')
}

function resolveMediaUrl(pathname) {
  if (!pathname) {
    return ''
  }

  if (/^https?:\/\//i.test(pathname)) {
    return pathname
  }

  return `${getApiOrigin()}${pathname.startsWith('/') ? '' : '/'}${pathname}`
}

function NewsAdminPage() {
  const {
    items,
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
  } = useNewsAdmin()

  const withMediaCount = useMemo(
    () => items.filter((item) => item.img_desktop || item.img_mobile).length,
    [items],
  )

  const desktopPreviewUrl = useMemo(() => {
    if (!form.img_desktop_file) {
      return ''
    }

    return URL.createObjectURL(form.img_desktop_file)
  }, [form.img_desktop_file])

  const mobilePreviewUrl = useMemo(() => {
    if (!form.img_mobile_file) {
      return ''
    }

    return URL.createObjectURL(form.img_mobile_file)
  }, [form.img_mobile_file])

  useEffect(() => {
    return () => {
      if (desktopPreviewUrl) {
        URL.revokeObjectURL(desktopPreviewUrl)
      }
    }
  }, [desktopPreviewUrl])

  useEffect(() => {
    return () => {
      if (mobilePreviewUrl) {
        URL.revokeObjectURL(mobilePreviewUrl)
      }
    }
  }, [mobilePreviewUrl])

  return (
  <main className="admin-page">

    {/* HERO */}
    <section className="admin-hero-card">
      <div className="hero-content">

        <div className="hero-text">
          <h1>Gestión de noticias</h1>
          <p>Alta, edición y eliminación de noticias.</p>
        </div>

        <div className="hero-meta">
          <span className="hero-badge">
            {total} noticias registradas
          </span>
        </div>

      </div>
    </section>

    {/* GRID */}
    <section className="admin-grid">

      {/* FORM */}
      <div className="panel-card review-form-card">

        <div className="panel-card-header">
          <div>
            <p className="panel-kicker">Formulario</p>
            <h2>{editingId ? 'Editar noticia' : 'Crear noticia'}</h2>
          </div>

          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={startCreate}
          >
            Limpiar
          </button>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>

          <div className="form-section">
            <label>Título</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => updateFormField('title', e.target.value)}
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div className="form-section">
            <label>Contenido</label>
            <TipTapEditor
              value={form.content}
              onChange={(value) => updateFormField('content', value)}
            />
          </div>

          <div className="form-grid-2">

            <div className="form-section">
              <label>YouTube</label>
              <input
                className="form-control"
                type="url"
                value={form.youtube_url}
                onChange={(e) => updateFormField('youtube_url', e.target.value)}
              />
            </div>

            <div className="form-section">
              <label>URL externa</label>
              <input
                className="form-control"
                type="url"
                value={form.external_url}
                onChange={(e) => updateFormField('external_url', e.target.value)}
              />
            </div>

          </div>

          <div className="form-grid-2">

            <div className="form-section">
              <label>Imagen desktop</label>
              <input
                type="file"
                className="form-control"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  updateFormField('img_desktop_file', e.target.files?.[0] || null)
                }
              />
            </div>

            <div className="form-section">
              <label>Imagen mobile</label>
              <input
                type="file"
                className="form-control"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  updateFormField('img_mobile_file', e.target.files?.[0] || null)
                }
              />
            </div>

          </div>

          <div className="form-actions">
            <button className="btn btn-primary btn-lg" type="submit">
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
            </button>

            <button
              type="button"
              className="btn btn-outline-light btn-lg"
              onClick={startCreate}
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>

      {/* LISTADO */}
      <div className="panel-card reviews-panel">

        <div className="panel-card-header">
          <div>
            <p className="panel-kicker">Listado</p>
            <h2>Noticias cargadas</h2>
          </div>

          <div className="panel-badge">
            Página {page} de {totalPages}
          </div>
        </div>

        <div className="filter-bar">
          <label>Buscar</label>
          <input
            className="form-control"
            value={filters.search}
            onChange={(e) => updateFilterField('search', e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {notice && <div className="alert alert-success mt-3">{notice}</div>}

        <div className="table-wrap">
          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle">

              <thead>
                <tr>
                  <th>Título</th>
                  <th>Contenido</th>
                  <th>Recursos</th>
                  <th>Fecha</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-secondary">
                      Cargando noticias...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-secondary">
                      No hay noticias para mostrar
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.news_id}>
                      <td>{item.title}</td>

                      <td>
                        {item.content
                          ? stripHtml(item.content).slice(0, 120) + '...'
                          : 'Sin contenido'}
                      </td>

                      <td>
                        {item.youtube_url && (
                          <a href={item.youtube_url} target="_blank" rel="noreferrer">
                            YouTube
                          </a>
                        )}
                      </td>

                      <td>{formatDate(item.created_at)}</td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => startEdit(item)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => handleDelete(item)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        </div>

        <div className="pagination-bar">
          <button
            className="btn btn-outline-light"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>

          <span>
            Mostrando {items.length} de {total} noticias
          </span>

          <button
            className="btn btn-outline-light"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>

      </div>

    </section>

  </main>
)
}

export default NewsAdminPage
