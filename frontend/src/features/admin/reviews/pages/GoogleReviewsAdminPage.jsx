import { useGoogleReviews } from '../hooks/useGoogleReviews'
import { formatReviewDate, formatShortDate, handleRatingStars } from './googleReviewsViewUtils'

function RatingStars({ value }) {
  return <span className="rating-stars">{handleRatingStars(value)}</span>
}

function GoogleReviewsAdminPage() {
  const {
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
  } = useGoogleReviews()

  const visibleCount = reviews.filter((review) => review.is_visible).length
  const hiddenCount = reviews.length - visibleCount

  return (
    <main className="admin-page">
      <section className="admin-hero-card">
    <div className="hero-content">

      <div className="hero-text">
        <h1>Gestión de reseñas</h1>
        <p>Alta, edición, visibilidad y eliminación de reseñas de Google.</p>
      </div>

      <div className="hero-meta">
        <span className="hero-badge">{total} reseñas en la base</span>
      </div>

    </div>
  </section>

      <section className="admin-grid">

  {/* FORM */}
  <div className="panel-card review-form-card">

    <div className="panel-card-header">
      <div>
        <p className="panel-kicker">Formulario</p>
        <h2>{editingId ? 'Editar reseña' : 'Crear reseña'}</h2>
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
        <label>Autor</label>
        <input
          className="form-control"
          value={form.author_name}
          onChange={(e) =>
            updateFormField('author_name', e.target.value)
          }
          required
        />
      </div>

      <div className="form-section">
        <label>Contenido</label>
        <textarea
          className="form-control"
          rows={4}
          value={form.content}
          onChange={(e) =>
            updateFormField('content', e.target.value)
          }
        />
      </div>

      <div className="form-grid-2">

        <div className="form-section">
          <label>Puntaje</label>
          <select
            className="form-select"
            value={form.rating}
            onChange={(e) =>
              updateFormField('rating', e.target.value)
            }
          >
            {[5,4,3,2,1].map((n) => (
              <option key={n} value={n}>
                {n} estrellas
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Fecha</label>
          <input
            className="form-control"
            type="datetime-local"
            value={form.review_date}
            onChange={(e) =>
              updateFormField('review_date', e.target.value)
            }
          />
        </div>

      </div>

      <div className="form-section">
        <label>URL reseña</label>
        <input
          className="form-control"
          type="url"
          value={form.review_url}
          onChange={(e) =>
            updateFormField('review_url', e.target.value)
          }
        />
      </div>

      <div className="form-switch-box">
        <input
          type="checkbox"
          checked={form.is_visible}
          onChange={(e) =>
            updateFormField('is_visible', e.target.checked)
          }
        />
        <span>Visible en la web</span>
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
        <h2>Reseñas cargadas</h2>
      </div>

      <div className="panel-badge">
        Página {page} de {totalPages}
      </div>
    </div>

    {/* FILTERS */}
    <div className="filter-bar">

      <div className="form-section">
        <label>Autor</label>
        <input
          className="form-control"
          value={filters.author_name}
          onChange={(e) =>
            updateFilterField('author_name', e.target.value)
          }
        />
      </div>

      <div className="form-section">
        <label>Puntaje</label>
        <select
          className="form-select"
          value={filters.rating}
          onChange={(e) =>
            updateFilterField('rating', e.target.value)
          }
        >
          <option value="">Todos</option>
          {[5,4,3,2,1].map((n) => (
            <option key={n} value={n}>
              {n} estrellas
            </option>
          ))}
        </select>
      </div>

    </div>

    {error && <div className="alert alert-danger mt-3">{error}</div>}
    {notice && <div className="alert alert-success mt-3">{notice}</div>}

    {/* TABLE */}
    <div className="table-wrap mt-3">
      <div className="table-responsive">

        <table className="table table-dark table-hover align-middle">

          <thead>
            <tr>
              <th>Autor</th>
              <th>Reseña</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-5 text-secondary">
                  Cargando reseñas...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5 text-secondary">
                  No hay reseñas
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr
                  key={r.review_id}
                  className={!r.is_visible ? 'row-muted' : ''}
                >

                  <td>
                    <strong>{r.author_name}</strong>
                    <div className="review-stars">
                      <RatingStars value={r.rating} />
                    </div>
                  </td>

                  <td>
                    <p className="review-content">
                      {r.content}
                    </p>
                    <a
                      href={r.review_url}
                      target="_blank"
                      rel="noreferrer"
                      className="review-link"
                    >
                      Ver reseña
                    </a>
                  </td>

                  <td>
                    <span className="review-date">
                      {formatReviewDate(r.review_date)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        r.is_visible ? 'is-visible' : 'is-hidden'
                      }`}
                    >
                      {r.is_visible ? 'Visible' : 'Oculta'}
                    </span>
                  </td>

                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => startEdit(r)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-outline-warning ms-2"
                      onClick={() => handleToggleVisibility(r)}
                    >
                      {r.is_visible ? 'Ocultar' : 'Mostrar'}
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => handleDelete(r)}
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

    {/* PAGINATION */}
    <div className="pagination-bar">

      <button
        className="btn btn-outline-light"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Anterior
      </button>

      <span>
        {reviews.length} de {total}
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

export default GoogleReviewsAdminPage