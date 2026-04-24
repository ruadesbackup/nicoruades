import { useRef, useState } from 'react'
import SeoHead from '../../../shared/seo/SeoHead'
import { useHomeData } from '../hooks/useHomeData'
import googleLogo from '../../../assets/google.webp'
import tribunalesBg from '../../../assets/Tribunales.jpeg'
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
  const reviewsScrollerRef = useRef(null)
  const [brokenAvatarMap, setBrokenAvatarMap] = useState({})
  const desktopSlides = carouselSlides.filter((slide) => slide.imgDesktopUrl)
  const mobileSlides = carouselSlides.filter((slide) => slide.imgMobileUrl)
  const hasAnyCarouselSlide = desktopSlides.length > 0 || mobileSlides.length > 0
  const canScrollReviews = reviews.length > 4

  const scrollReviews = (direction) => {
    const container = reviewsScrollerRef.current
    if (!container) return

    const firstCard = container.querySelector('.review-card-google')
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : container.clientWidth / 4
    container.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: 'smooth',
    })
  }

  const markAvatarAsBroken = (reviewId) => {
    if (!reviewId) return
    setBrokenAvatarMap((current) => {
      if (current[reviewId]) return current
      return { ...current, [reviewId]: true }
    })
  }

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

      {/* HERO + BANNER en bloque conjunto */}
      <section className="hero-banner-combo">
        <div className="hero-banner-inner">
          <div className="hero-content left">
            <h1 className="hero-title">Abogado Penalista<br /><span>Nicolás Ruades</span></h1>
            <p className="hero-subtitle">
              Defensa penal estratégica y asesoramiento profesional en causas complejas.<br />
              Córdoba, Argentina
            </p>
            <a href="#servicios" className="hero-cta-btn">Conocé nuestros servicios</a>
          </div>
          <div className="hero-banner-carousel right">
            {/* Carrusel solo desktop, imagen destacada si no hay slides */}
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
            ) : (
              <div className="hero-banner-placeholder">
                <img src={tribunalesBg} alt="Banner legal" className="home-carousel-image" />
              </div>
            )}
          </div>
        </div>
        {/* Carrusel mobile debajo */}
        {mobileSlides.length > 0 && (
          <div className="hero-banner-carousel mobile-only">
            <div id="homeCarouselMobile" className="carousel slide" data-bs-ride="carousel">
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
          </div>
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

      <section id="servicios" className="home-section services-section" aria-label="Servicios que brindamos">
        <div className="home-section-heading">
          <h2>Servicios que brindamos</h2>
          <p>
            Asesoramiento y defensa en áreas clave del derecho, con seguimiento profesional y estrategia personalizada.
          </p>
        </div>

        <div className="services-grid">
          <article className="service-card">
            <h3>Penal</h3>
            <p>Narcotráfico, asociaciones ilícitas y defensa penal integral en causas complejas.</p>
          </article>

          <article className="service-card">
            <h3>Laboral</h3>
            <p>Asistencia en conflictos laborales, reclamos y protección de derechos del trabajador.</p>
          </article>

          <article className="service-card">
            <h3>ART</h3>
            <p>Gestión de accidentes laborales, incapacidades y reclamos ante aseguradoras.</p>
          </article>

          <article className="service-card">
            <h3>Civil</h3>
            <p>Soluciones en controversias civiles, reclamos patrimoniales y asesoramiento legal.</p>
          </article>

          <article className="service-card">
            <h3>Derecho de familia</h3>
            <p>Divorcios, alimentos, cuidado personal, régimen de comunicación y medidas urgentes.</p>
          </article>

          <article className="service-card">
            <h3>Accidente de tránsito</h3>
            <p>Reclamos por daños y perjuicios, lesiones y seguimiento completo del caso.</p>
          </article>

          <article className="service-card">
            <h3>Ejecuciones</h3>
            <p>Defensa y gestión en procesos ejecutivos, cobros judiciales y embargos.</p>
          </article>
        </div>
      </section>

      <section
        id="resenas"
        className="home-section reviews-section reviews-section-bg"
        aria-label="Reseñas de Google Maps"
        style={{
          position: 'relative',
        }}
      >
        <div className="home-section-heading">
          <div className="reviews-heading-brand">
                <h2>Clientes satisfechos respaldan nuestro trabajo</h2>
          </div>
          <p>Experiencias reales de clientes que confiaron su defensa al estudio.</p>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="reviews-carousel-shell">
          {canScrollReviews ? (
            <button
              type="button"
              className="reviews-carousel-arrow reviews-carousel-arrow-prev"
              onClick={() => scrollReviews(-1)}
              aria-label="Ver reseñas anteriores"
            >
              <span aria-hidden="true">‹</span>
            </button>
          ) : null}

          <div className="reviews-google-list" ref={reviewsScrollerRef} role="list">
          {reviews.length === 0 ? (
            <article className="review-card">Aún no hay reseñas públicas para mostrar.</article>
          ) : (
            reviews.map((review) => (
              <article key={review.review_id} className="review-card review-card-google" role="listitem">
                <div className="review-card-content">
                  <header className="review-header-google">
                    <div className="review-author-google">
                      {review.profile_photo_url && !brokenAvatarMap[review.review_id] ? (
                        <img
                          src={review.profile_photo_url}
                          alt={`Foto de perfil de ${review.author_name || 'cliente'}`}
                          className="review-author-avatar"
                          loading="lazy"
                          onError={() => markAvatarAsBroken(review.review_id)}
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
                    </div>
                  </header>

                  <p>{review.content || 'Reseña sin texto.'}</p>
                </div>

                <div className="review-card-footer-google">
                  <img src={googleLogo} alt="Google" className="review-google-mark" loading="lazy" />

                  {review.review_url ? (
                    <a href={review.review_url} target="_blank" rel="noreferrer">
                      Ver reseña original
                    </a>
                  ) : null}
                </div>
              </article>
            ))
          )}
          </div>

          {canScrollReviews ? (
            <button
              type="button"
              className="reviews-carousel-arrow reviews-carousel-arrow-next"
              onClick={() => scrollReviews(1)}
              aria-label="Ver reseñas siguientes"
            >
              <span aria-hidden="true">›</span>
            </button>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default HomePage
