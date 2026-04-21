import SeoHead from '../../../shared/seo/SeoHead'
import { useHomeData } from '../hooks/useHomeData'
import './HomePage.css'

function ratingStars(value) {
  const safe = Math.max(1, Math.min(5, Number(value) || 0))
  return '★'.repeat(safe) + '☆'.repeat(Math.max(0, 5 - safe))
}

function formatReviewDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function authorFallback(name) {
  const text = (name || 'Cliente').trim()
  return text.charAt(0).toUpperCase()
}

function HomePage() {
  const { carouselSlides, reviews, loading, error } = useHomeData()
  const desktopSlides = carouselSlides.filter((slide) => slide.imgDesktopUrl)
  const mobileSlides = carouselSlides.filter((slide) => slide.imgMobileUrl)
  const hasAnyCarouselSlide = desktopSlides.length > 0 || mobileSlides.length > 0

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Abogado Penalista - Nicolas Ruades',
    areaServed: 'Argentina',
    description:
      'Defensa penal estratégica y asesoramiento profesional en causas complejas.',
    aggregateRating: reviews.length
      ? {
          '@type': 'AggregateRating',
          ratingValue:
            reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length,
          reviewCount: reviews.length,
        }
      : undefined,
  }

  return (
    <main className="home-page">
      <SeoHead
        title="Abogado Penalista | Nicolas Ruades"
        description="Defensa penal profesional, estrategia jurídica y acompañamiento en cada etapa del proceso."
        canonicalPath="/"
        jsonLd={localBusinessJsonLd}
      />

      <section className="home-carousel" aria-label="Banners principales">
        {!hasAnyCarouselSlide ? (
          <div className="home-carousel-empty">
            {loading ? 'Cargando banners...' : 'Próximamente: banners del estudio.'}
          </div>
        ) : (
          <>
            {desktopSlides.length > 0 ? (
              <div id="homeCarouselDesktop" className="carousel slide desktop-only" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  {desktopSlides.map((slide, index) => (
                    <button
                      key={`desktop-${slide.carousel_id}`}
                      type="button"
                      data-bs-target="#homeCarouselDesktop"
                      data-bs-slide-to={index}
                      className={index === 0 ? 'active' : ''}
                      aria-current={index === 0 ? 'true' : undefined}
                      aria-label={`Slide desktop ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="carousel-inner home-carousel-inner">
                  {desktopSlides.map((slide, index) => (
                    <article
                      key={`desktop-item-${slide.carousel_id}`}
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    >
                      <img
                        src={slide.imgDesktopUrl}
                        className="d-block w-100 home-carousel-image"
                        alt={`Banner legal desktop ${index + 1}`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </article>
                  ))}
                </div>

                {desktopSlides.length > 1 ? (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#homeCarouselDesktop"
                      data-bs-slide="prev"
                      aria-label="Slide anterior"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true" />
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#homeCarouselDesktop"
                      data-bs-slide="next"
                      aria-label="Slide siguiente"
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true" />
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}

            {mobileSlides.length > 0 ? (
              <div id="homeCarouselMobile" className="carousel slide mobile-only" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  {mobileSlides.map((slide, index) => (
                    <button
                      key={`mobile-${slide.carousel_id}`}
                      type="button"
                      data-bs-target="#homeCarouselMobile"
                      data-bs-slide-to={index}
                      className={index === 0 ? 'active' : ''}
                      aria-current={index === 0 ? 'true' : undefined}
                      aria-label={`Slide mobile ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="carousel-inner home-carousel-inner">
                  {mobileSlides.map((slide, index) => (
                    <article
                      key={`mobile-item-${slide.carousel_id}`}
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    >
                      <img
                        src={slide.imgMobileUrl}
                        className="d-block w-100 home-carousel-image"
                        alt={`Banner legal mobile ${index + 1}`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </article>
                  ))}
                </div>

                {mobileSlides.length > 1 ? (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#homeCarouselMobile"
                      data-bs-slide="prev"
                      aria-label="Slide anterior"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true" />
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#homeCarouselMobile"
                      data-bs-slide="next"
                      aria-label="Slide siguiente"
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true" />
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </section>

      <section id="quienes-somos" className="home-section who-section">
        <div className="home-section-heading">
          <h1 className="visually-hidden">Abogado Penalista</h1>
          <p className="visually-hidden">
            Abogado penalista en Córdoba, Argentina. Defensa penal técnica, estrategia jurídica
            personalizada y asesoramiento integral en denuncias, imputaciones, excarcelaciones,
            juicios penales y recursos, incluyendo narcotráfico y asociaciones ilícitas.
            Asistencia legal en derecho laboral, ART, derecho civil, derecho de familia,
            accidentes de tránsito y ejecuciones. Acompañamiento profesional y compromiso
            personal para proteger tus derechos en cada etapa del proceso.
          </p>
        </div>

        <div className="who-single">
          <h2>Quiénes Somos</h2>
          <p>
            Somos una firma legal moderna y dinámica liderada por el Abg. Nicolás Ruades, dedicada a brindar soluciones
             integrales con un enfoque en la excelencia y la transparencia. Nos especializamos en diversas áreas del derecho
             (Penal, laboral, ART, Derecho de familia, Accidentes de transito, ejecuciones), combinando una sólida formación técnica con un trato humano y personalizado.
             En nuestro estudio, entendemos que cada caso es único; por eso, nos alejamos de la abogacía tradicional para ofrecer
             un servicio ágil, basado en la comunicación constante y la búsqueda estratégica de resultados. Nuestra misión es proteger
             tus intereses y garantizar una representación firme, profesional y confiable en cada etapa del proceso judicial.
          </p>
        </div>
      </section>

      <section id="resenas" className="home-section reviews-section" aria-label="Reseñas de Google Maps">
        <div className="home-section-heading">
          <h2>Comentarios de Google Maps</h2>
          <p>Experiencias reales de clientes que confiaron su defensa al estudio.</p>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="reviews-google-list" role="list">
          {reviews.length === 0 ? (
            <article className="review-card">Aún no hay reseñas públicas para mostrar.</article>
          ) : (
            reviews.map((review, index) => (
              <article key={review.review_id} className="review-card review-card-google" role="listitem">
                <span className="review-order" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <header className="review-header-google">
                  <div className="review-author-google">
                    {review.profile_photo_url ? (
                      <img
                        src={review.profile_photo_url}
                        alt={`Foto de perfil de ${review.author_name || 'cliente'}`}
                        className="review-author-avatar"
                        loading="lazy"
                      />
                    ) : (
                      <div className="review-author-avatar review-author-avatar-fallback" aria-hidden="true">
                        {authorFallback(review.author_name)}
                      </div>
                    )}

                    <div className="review-author-meta">
                      <strong>{review.author_name || 'Cliente'}</strong>
                      <span>{formatReviewDate(review.review_date)}</span>
                    </div>
                  </div>

                  <div className="review-rating-google">
                    <span className="review-stars-public">{ratingStars(review.rating)}</span>
                    <span className="review-google-badge">Google</span>
                  </div>
                </header>

                <p>{review.content || 'Reseña sin texto.'}</p>

                {review.review_url ? (
                  <a href={review.review_url} target="_blank" rel="noreferrer">
                    Ver reseña original
                  </a>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePage
