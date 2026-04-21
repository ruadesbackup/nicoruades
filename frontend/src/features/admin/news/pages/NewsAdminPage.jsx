import { useEffect, useMemo } from 'react'
import { useNewsAdmin } from '../hooks/useNewsAdmin'

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
      <section className="admin-hero">
        <div className="hero-copy">
          <span className="eyebrow">Panel de administración</span>
          <h1>Gestión de noticias</h1>
          <p>Alta, edición y eliminación de noticias conectadas al backend Node/PostgreSQL.</p>
          <div className="hero-actions">
            <span className="hero-note">{total} noticias registradas</span>
          </div>
        </div>

        <div className="hero-stats">
          <article className="stat-card">
            <span>Total</span>
            <strong>{total}</strong>
            <small>Noticias en base</small>
          </article>
          <article className="stat-card stat-card-success">
            <span>Con imagen</span>
            <strong>{withMediaCount}</strong>
            <small>De la página actual</small>
          </article>
          <article className="stat-card stat-card-muted">
            <span>Sin imagen</span>
            <strong>{Math.max(0, items.length - withMediaCount)}</strong>
            <small>De la página actual</small>
          </article>
        </div>
      </section>

      <section className="admin-grid">
        <div className="panel-card review-form-card">
          <div className="panel-card-header">
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>{editingId ? 'Editar noticia' : 'Crear noticia'}</h2>
            </div>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={startCreate}>
              Limpiar
            </button>
          </div>

          <form className="review-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Título</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(event) => updateFormField('title', event.target.value)}
                  placeholder="Título de la noticia"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Contenido</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={form.content}
                  onChange={(event) => updateFormField('content', event.target.value)}
                  placeholder="Texto de la noticia"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">URL de YouTube</label>
                <input
                  className="form-control"
                  type="url"
                  value={form.youtube_url}
                  onChange={(event) => updateFormField('youtube_url', event.target.value)}
                  placeholder="https://www.youtube.com/..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">URL externa</label>
                <input
                  className="form-control"
                  type="url"
                  value={form.external_url}
                  onChange={(event) => updateFormField('external_url', event.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Imagen desktop</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => updateFormField('img_desktop_file', event.target.files?.[0] || null)}
                />
                {desktopPreviewUrl ? (
                  <div className="news-preview-wrap mt-2">
                    <img src={desktopPreviewUrl} alt="Preview desktop" className="news-preview-image" />
                    <small className="text-secondary">Nueva imagen desktop</small>
                  </div>
                ) : null}
                {editingItem?.img_desktop ? (
                  <div className="news-preview-wrap mt-2">
                    <img
                      src={resolveMediaUrl(editingItem.img_desktop)}
                      alt="Desktop actual"
                      className="news-preview-image"
                    />
                    <small className="text-secondary d-block">
                      Actual:{' '}
                      <a
                        className="review-link"
                        href={resolveMediaUrl(editingItem.img_desktop)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ver imagen
                      </a>
                    </small>
                  </div>
                ) : null}
              </div>

              <div className="col-md-6">
                <label className="form-label">Imagen mobile</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => updateFormField('img_mobile_file', event.target.files?.[0] || null)}
                />
                {mobilePreviewUrl ? (
                  <div className="news-preview-wrap mt-2">
                    <img src={mobilePreviewUrl} alt="Preview mobile" className="news-preview-image" />
                    <small className="text-secondary">Nueva imagen mobile</small>
                  </div>
                ) : null}
                {editingItem?.img_mobile ? (
                  <div className="news-preview-wrap mt-2">
                    <img
                      src={resolveMediaUrl(editingItem.img_mobile)}
                      alt="Mobile actual"
                      className="news-preview-image"
                    />
                    <small className="text-secondary d-block">
                      Actual:{' '}
                      <a
                        className="review-link"
                        href={resolveMediaUrl(editingItem.img_mobile)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ver imagen
                      </a>
                    </small>
                  </div>
                ) : null}
              </div>

              <div className="col-12 d-flex gap-2 flex-wrap mt-2">
                <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Actualizar noticia' : 'Crear noticia'}
                </button>
                <button type="button" className="btn btn-outline-light btn-lg" onClick={startCreate}>
                  Cancelar edición
                </button>
              </div>
            </div>
          </form>
        </div>

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

          <div className="filter-bar row g-3">
            <div className="col-12">
              <label className="form-label">Buscar</label>
              <input
                className="form-control"
                value={filters.search}
                onChange={(event) => updateFilterField('search', event.target.value)}
                placeholder="Buscar por título, contenido o slug"
              />
            </div>
          </div>

          {error ? <div className="alert alert-danger mt-3">{error}</div> : null}
          {notice ? <div className="alert alert-success mt-3">{notice}</div> : null}

          <div className="table-wrap mt-3">
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
                        No hay noticias para mostrar.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.news_id}>
                        <td>
                          <strong>{item.title}</strong>
                          <small className="d-block text-secondary">/{item.slug}</small>
                        </td>
                        <td>
                          <p className="review-content mb-0">
                            {item.content ? `${item.content.slice(0, 140)}${item.content.length > 140 ? '...' : ''}` : 'Sin contenido'}
                          </p>
                        </td>
                        <td>
                          <div className="action-group">
                            <div className="news-thumb-grid">
                              {item.img_desktop ? (
                                <a href={resolveMediaUrl(item.img_desktop)} target="_blank" rel="noreferrer">
                                  <img
                                    src={resolveMediaUrl(item.img_desktop)}
                                    alt={`Desktop ${item.title}`}
                                    className="news-thumb"
                                  />
                                </a>
                              ) : null}
                              {item.img_mobile ? (
                                <a href={resolveMediaUrl(item.img_mobile)} target="_blank" rel="noreferrer">
                                  <img
                                    src={resolveMediaUrl(item.img_mobile)}
                                    alt={`Mobile ${item.title}`}
                                    className="news-thumb"
                                  />
                                </a>
                              ) : null}
                            </div>
                            {item.img_desktop ? (
                              <a className="btn btn-sm btn-outline-light" href={resolveMediaUrl(item.img_desktop)} target="_blank" rel="noreferrer">
                                Img desktop
                              </a>
                            ) : null}
                            {item.img_mobile ? (
                              <a className="btn btn-sm btn-outline-light" href={resolveMediaUrl(item.img_mobile)} target="_blank" rel="noreferrer">
                                Img mobile
                              </a>
                            ) : null}
                            {item.youtube_url ? (
                              <a className="btn btn-sm btn-outline-info" href={item.youtube_url} target="_blank" rel="noreferrer">
                                YouTube
                              </a>
                            ) : null}
                            {item.external_url ? (
                              <a className="btn btn-sm btn-outline-secondary" href={item.external_url} target="_blank" rel="noreferrer">
                                Externa
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <span className="review-date">{formatDate(item.created_at)}</span>
                        </td>
                        <td>
                          <div className="action-group justify-content-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              onClick={() => startEdit(item)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              disabled={deletingId === item.news_id}
                              onClick={() => handleDelete(item)}
                            >
                              {deletingId === item.news_id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </div>
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
              type="button"
              className="btn btn-outline-light"
              disabled={page <= 1}
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            >
              Anterior
            </button>
            <span>
              Mostrando {items.length} de {total} noticias
            </span>
            <button
              type="button"
              className="btn btn-outline-light"
              disabled={page >= totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
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
