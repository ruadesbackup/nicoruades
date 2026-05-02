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
      <section className="admin-hero-card">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Gestión de banners</h1>
            <p>Carga, edición y eliminación de banners.</p>
          </div>
        </div>
      </section>

      <section className="admin-grid">

  {/* FORM */}
  <div className="panel-card review-form-card">

    <div className="panel-card-header">
      <div>
        <p className="panel-kicker">Formulario</p>
        <h2>{editingId ? 'Editar banner' : 'Crear banner'}</h2>
      </div>
    </div>

    <form className="review-form" onSubmit={handleSubmit}>

      <div className="form-grid-2">

        <div className="form-section">
          <label>Orden</label>
          <input
            className="form-control"
            type="number"
            min="0"
            value={form.display_order}
            onChange={(e) =>
              updateFormField('display_order', e.target.value)
            }
            required
          />
        </div>

        <div className="form-section">
          <label>Noticia asociada</label>
          <select
            className="form-select"
            value={form.news_id}
            onChange={(e) =>
              updateFormField('news_id', e.target.value)
            }
          >
            <option value="">Sin noticia</option>
            {newsOptions.map((n) => (
              <option key={n.news_id} value={n.news_id}>
                #{n.news_id} - {n.title}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* IMAGEN */}
      <div className="form-section">
        <label>Imagen desktop</label>
        <input
          className="form-control"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) =>
            updateFormField('img_desktop_file', e.target.files?.[0] || null)
          }
        />
        <small className="text-secondary">Formato horizontal recomendado</small>

        <div className="media-preview-box">

          {desktopPreviewUrl ? (
            <img
              src={desktopPreviewUrl}
              className="banner-preview"
              alt="preview"
            />
          ) : editingItem?.img_desktop ? (
            <img
              src={resolveMediaUrl(editingItem.img_desktop)}
              className="banner-preview"
              alt="actual"
            />
          ) : (
            <span className="text-secondary">Sin imagen</span>
          )}

          {editingItem?.img_desktop && (
            <button
              type="button"
              className="btn btn-sm btn-outline-warning mt-2"
              onClick={() => handleRemoveMedia(editingItem, 'desktop')}
            >
              Quitar imagen
            </button>
          )}

        </div>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button className="btn btn-primary btn-lg" type="submit">
          {saving ? 'Guardando...' : editingId ? 'Actualizar banner' : 'Crear banner'}
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
        <h2>Banners cargados</h2>
      </div>

      <div className="panel-badge">{items.length} registros</div>
    </div>

    {error && <div className="alert alert-danger mt-3">{error}</div>}
    {notice && <div className="alert alert-success mt-3">{notice}</div>}

    <div className="table-wrap mt-3">
      <div className="table-responsive">

        <table className="table table-dark table-hover align-middle">

          <thead>
            <tr>
              <th>Imagen</th>
              <th>Orden</th>
              <th>Noticia</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-5 text-secondary">
                  Cargando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-5 text-secondary">
                  No hay banners
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.carousel_id}>

                  <td>
                    {item.img_desktop ? (
                      <img
                        src={resolveMediaUrl(item.img_desktop)}
                        className="banner-thumb"
                        alt="banner"
                      />
                    ) : (
                      <span className="text-secondary">Sin imagen</span>
                    )}
                  </td>

                  <td>
                    <div className="order-box">
                      <strong>{item.display_order}</strong>

                      <div className="action-group">
                        <button
                          className="btn btn-sm btn-outline-light"
                          onClick={() => moveItem(item, 'up')}
                        >
                          ↑
                        </button>
                        <button
                          className="btn btn-sm btn-outline-light"
                          onClick={() => moveItem(item, 'down')}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </td>

                  <td>
                    {item.news_id
                      ? `#${item.news_id}`
                      : 'Sin noticia'}
                  </td>

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

  </div>

</section>
    </main>
  )
}

export default CarouselAdminPage
