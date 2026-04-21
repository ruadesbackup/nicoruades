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
      <section className="admin-hero">
        <div className="hero-copy">
          <span className="eyebrow">Panel de administración</span>
          <h1>Gestión de reseñas</h1>
          <p>
            Alta, edición, visibilidad y eliminación de reseñas de Google desde un panel único.
          </p>
          <div className="hero-actions">
            <span className="hero-note">{total} registros en la base</span>
          </div>
        </div>

        <div className="hero-stats">
          <article className="stat-card">
            <span>Total</span>
            <strong>{total}</strong>
            <small>Reseñas guardadas</small>
          </article>
          <article className="stat-card stat-card-success">
            <span>Visibles</span>
            <strong>{visibleCount}</strong>
            <small>De la página actual</small>
          </article>
          <article className="stat-card stat-card-muted">
            <span>Ocultas</span>
            <strong>{hiddenCount}</strong>
            <small>De la página actual</small>
          </article>
        </div>
      </section>

      <section className="admin-grid">
        <div className="panel-card review-form-card">
          <div className="panel-card-header">
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>{editingId ? 'Editar reseña' : 'Crear reseña'}</h2>
            </div>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={startCreate}>
              Limpiar
            </button>
          </div>

          <form className="review-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Autor</label>
                <input
                  className="form-control"
                  value={form.author_name}
                  onChange={(event) => updateFormField('author_name', event.target.value)}
                  placeholder="Nombre visible de la reseña"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Contenido</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={form.content}
                  onChange={(event) => updateFormField('content', event.target.value)}
                  placeholder="Texto completo de la reseña"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Puntaje</label>
                <select
                  className="form-select"
                  value={form.rating}
                  onChange={(event) => updateFormField('rating', event.target.value)}
                  required
                >
                  <option value="5">5 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="3">3 estrellas</option>
                  <option value="2">2 estrellas</option>
                  <option value="1">1 estrella</option>
                </select>
              </div>

              <div className="col-md-8">
                <label className="form-label">URL de la reseña</label>
                <input
                  className="form-control"
                  type="url"
                  value={form.review_url}
                  onChange={(event) => updateFormField('review_url', event.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">URL de foto de perfil</label>
                <input
                  className="form-control"
                  type="url"
                  value={form.profile_photo_url}
                  onChange={(event) => updateFormField('profile_photo_url', event.target.value)}
                  placeholder="Opcional"
                />
              </div>

              <div className="col-md-7">
                <label className="form-label">Fecha de la reseña</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  value={form.review_date}
                  onChange={(event) => updateFormField('review_date', event.target.value)}
                  required
                />
              </div>

              <div className="col-md-5 d-flex align-items-end">
                <label className="form-check review-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.is_visible}
                    onChange={(event) => updateFormField('is_visible', event.target.checked)}
                  />
                  <span className="form-check-label">Visible en la web</span>
                </label>
              </div>

              <div className="col-12 d-flex gap-2 flex-wrap mt-2">
                <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Actualizar reseña' : 'Crear reseña'}
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
              <h2>Reseñas cargadas</h2>
            </div>
            <div className="panel-badge">
              Página {page} de {totalPages}
            </div>
          </div>

          <div className="filter-bar row g-3">
            <div className="col-md-7">
              <label className="form-label">Filtrar por autor</label>
              <input
                className="form-control"
                value={filters.author_name}
                onChange={(event) => updateFilterField('author_name', event.target.value)}
                placeholder="Buscar por nombre"
              />
            </div>
            <div className="col-md-5">
              <label className="form-label">Filtrar por puntaje</label>
              <select
                className="form-select"
                value={filters.rating}
                onChange={(event) => updateFilterField('rating', event.target.value)}
              >
                <option value="">Todos</option>
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
            </div>
          </div>

          {error ? <div className="alert alert-danger mt-3">{error}</div> : null}
          {notice ? <div className="alert alert-success mt-3">{notice}</div> : null}

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
                        No hay reseñas para mostrar.
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review.review_id} className={review.is_visible ? '' : 'row-muted'}>
                        <td>
                          <div className="review-author">
                            <div className="review-avatar">
                              {review.profile_photo_url ? (
                                <img src={review.profile_photo_url} alt={review.author_name} />
                              ) : (
                                <span>{review.author_name?.slice(0, 1)?.toUpperCase() || '?'}</span>
                              )}
                            </div>
                            <div>
                              <strong>{review.author_name}</strong>
                              <div className="review-stars">
                                <RatingStars value={review.rating} />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="review-content">{review.content || 'Sin contenido textual'}</p>
                          <a href={review.review_url} target="_blank" rel="noreferrer" className="review-link">
                            Ver reseña
                          </a>
                        </td>
                        <td>
                          <span className="review-date">{formatReviewDate(review.review_date)}</span>
                          <small className="d-block text-secondary">{formatShortDate(review.created_at)}</small>
                        </td>
                        <td>
                          <span className={`status-pill ${review.is_visible ? 'is-visible' : 'is-hidden'}`}>
                            {review.is_visible ? 'Visible' : 'Oculta'}
                          </span>
                        </td>
                        <td>
                          <div className="action-group justify-content-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              onClick={() => startEdit(review)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleToggleVisibility(review)}
                            >
                              {review.is_visible ? 'Ocultar' : 'Mostrar'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              disabled={deletingId === review.review_id}
                              onClick={() => handleDelete(review)}
                            >
                              {deletingId === review.review_id ? 'Eliminando...' : 'Eliminar'}
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
              Mostrando {reviews.length} de {total} reseñas
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

export default GoogleReviewsAdminPage