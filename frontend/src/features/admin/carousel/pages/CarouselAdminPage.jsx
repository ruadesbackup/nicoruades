import { useEffect, useMemo } from 'react'
import { useCarouselAdmin } from '../hooks/useCarouselAdmin'

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

function CarouselAdminPage() {
  const {
    items,
    newsTitleById,
    loading,
    saving,
    reordering,
    removingMediaKey,
    deletingId,
    form,
    editingId,
    editingItem,
    error,
    notice,
    newsOptions,
    startCreate,
    startEdit,
    updateFormField,
    handleSubmit,
    handleDelete,
    moveItem,
    handleRemoveMedia,
  } = useCarouselAdmin()

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
          <h1>Gestión de banners Home</h1>
          <p>Carga, edición y eliminación de banners.</p>
          <div className="hero-actions">
            <span className="hero-note">{items.length} banners configurados</span>
          </div>
        </div>

        <div className="hero-stats">
          <article className="stat-card">
            <span>Total</span>
            <strong>{items.length}</strong>
            <small>Banners activos</small>
          </article>
          <article className="stat-card stat-card-success">
            <span>Con noticia</span>
            <strong>{items.filter((item) => item.news_id).length}</strong>
            <small>Vinculados</small>
          </article>
          <article className="stat-card stat-card-muted">
            <span>Sin noticia</span>
            <strong>{items.filter((item) => !item.news_id).length}</strong>
            <small>Sin vínculo</small>
          </article>
        </div>
      </section>

      <section className="admin-grid">
        <div className="panel-card review-form-card">
          <div className="panel-card-header">
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>{editingId ? 'Editar banner' : 'Crear banner'}</h2>
            </div>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={startCreate}>
              Limpiar
            </button>
          </div>

          <form className="review-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Orden</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={(event) => updateFormField('display_order', event.target.value)}
                  required
                />
              </div>

              <div className="col-md-8">
                <label className="form-label">Noticia asociada</label>
                <select
                  className="form-select"
                  value={form.news_id}
                  onChange={(event) => updateFormField('news_id', event.target.value)}
                >
                  <option value="">Sin noticia</option>
                  {newsOptions.map((news) => (
                    <option key={news.news_id} value={news.news_id}>
                      #{news.news_id} - {news.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Imagen desktop</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => updateFormField('img_desktop_file', event.target.files?.[0] || null)}
                />
                <small className="text-secondary d-block mt-1">Formato recomendado: horizontal (desktop)</small>
                <div className="banner-media-slot mt-2">
                  <span className="banner-media-label desktop">Desktop</span>
                  {desktopPreviewUrl ? (
                    <div className="news-preview-wrap mt-2">
                      <img
                        src={desktopPreviewUrl}
                        alt="Preview desktop"
                        className="news-preview-image banner-preview-desktop"
                      />
                    </div>
                  ) : null}
                  {!desktopPreviewUrl && editingItem?.img_desktop ? (
                    <div className="news-preview-wrap mt-2">
                      <img
                        src={resolveMediaUrl(editingItem.img_desktop)}
                        alt="Desktop actual"
                        className="news-preview-image banner-preview-desktop"
                      />
                    </div>
                  ) : null}
                  {editingItem?.img_desktop ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning mt-2"
                      disabled={removingMediaKey === `desktop-${editingItem.carousel_id}`}
                      onClick={() => handleRemoveMedia(editingItem, 'desktop')}
                    >
                      {removingMediaKey === `desktop-${editingItem.carousel_id}` ? 'Quitando...' : 'Quitar desktop'}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Imagen mobile</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => updateFormField('img_mobile_file', event.target.files?.[0] || null)}
                />
                <small className="text-secondary d-block mt-1">Formato recomendado: vertical (mobile)</small>
                <div className="banner-media-slot mt-2">
                  <span className="banner-media-label mobile">Mobile</span>
                  {mobilePreviewUrl ? (
                    <div className="news-preview-wrap mt-2">
                      <img
                        src={mobilePreviewUrl}
                        alt="Preview mobile"
                        className="news-preview-image banner-preview-mobile"
                      />
                    </div>
                  ) : null}
                  {!mobilePreviewUrl && editingItem?.img_mobile ? (
                    <div className="news-preview-wrap mt-2">
                      <img
                        src={resolveMediaUrl(editingItem.img_mobile)}
                        alt="Mobile actual"
                        className="news-preview-image banner-preview-mobile"
                      />
                    </div>
                  ) : null}
                  {editingItem?.img_mobile ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning mt-2"
                      disabled={removingMediaKey === `mobile-${editingItem.carousel_id}`}
                      onClick={() => handleRemoveMedia(editingItem, 'mobile')}
                    >
                      {removingMediaKey === `mobile-${editingItem.carousel_id}` ? 'Quitando...' : 'Quitar mobile'}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="col-12 d-flex gap-2 flex-wrap mt-2">
                <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Actualizar banner' : 'Crear banner'}
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
              <h2>Banners cargados</h2>
            </div>
            <div className="panel-badge">{items.length} registros</div>
          </div>

          {error ? <div className="alert alert-danger mt-3">{error}</div> : null}
          {notice ? <div className="alert alert-success mt-3">{notice}</div> : null}

          <div className="table-wrap mt-3">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Desktop</th>
                    <th>Mobile</th>
                    <th>Orden</th>
                    <th>Noticia</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-secondary">
                        Cargando banners...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-secondary">
                        No hay banners para mostrar.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.carousel_id}>
                        <td>
                          <strong>#{item.carousel_id}</strong>
                        </td>
                        <td>
                          {item.img_desktop ? (
                            <div className="banner-cell-stack">
                              <a href={resolveMediaUrl(item.img_desktop)} target="_blank" rel="noreferrer">
                                <img
                                  src={resolveMediaUrl(item.img_desktop)}
                                  alt={`Desktop banner ${item.carousel_id}`}
                                  className="news-thumb banner-thumb-desktop"
                                />
                              </a>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning"
                                disabled={removingMediaKey === `desktop-${item.carousel_id}`}
                                onClick={() => handleRemoveMedia(item, 'desktop')}
                              >
                                {removingMediaKey === `desktop-${item.carousel_id}` ? 'Quitando...' : 'Quitar'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-secondary">Sin desktop</span>
                          )}
                        </td>
                        <td>
                          {item.img_mobile ? (
                            <div className="banner-cell-stack">
                              <a href={resolveMediaUrl(item.img_mobile)} target="_blank" rel="noreferrer">
                                <img
                                  src={resolveMediaUrl(item.img_mobile)}
                                  alt={`Mobile banner ${item.carousel_id}`}
                                  className="news-thumb banner-thumb-mobile"
                                />
                              </a>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning"
                                disabled={removingMediaKey === `mobile-${item.carousel_id}`}
                                onClick={() => handleRemoveMedia(item, 'mobile')}
                              >
                                {removingMediaKey === `mobile-${item.carousel_id}` ? 'Quitando...' : 'Quitar'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-secondary">Sin mobile</span>
                          )}
                        </td>
                        <td>
                          <div className="order-controls">
                            <strong>{item.display_order}</strong>
                            <div className="action-group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light"
                                disabled={reordering || loading}
                                onClick={() => moveItem(item, 'up')}
                              >
                                Subir
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light"
                                disabled={reordering || loading}
                                onClick={() => moveItem(item, 'down')}
                              >
                                Bajar
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>{item.news_id ? `#${item.news_id} - ${newsTitleById.get(item.news_id) || 'Noticia no encontrada'}` : 'Sin noticia'}</td>
                        <td>
                          <div className="action-group justify-content-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              disabled={reordering}
                              onClick={() => startEdit(item)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              disabled={deletingId === item.carousel_id || reordering}
                              onClick={() => handleDelete(item)}
                            >
                              {deletingId === item.carousel_id ? 'Eliminando...' : 'Eliminar'}
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
        </div>
      </section>
    </main>
  )
}

export default CarouselAdminPage
