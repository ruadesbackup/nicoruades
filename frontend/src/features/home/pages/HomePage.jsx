import { useRef, useState, useEffect } from 'react'
import SeoHead from '../../../shared/seo/SeoHead'
import { useHomeData } from '../hooks/useHomeData'
import googleLogo from '../../../assets/google.webp'
import tribunalesBg from '../../../assets/Tribunales.jpeg'
import './HomePage.css'
import nicolasRuadesImg from '../../../assets/perfil/NicolasRuades.jpg'

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
  // --- Corrección para sección de servicios ---
  const scrollRef = useRef(null)
  // Nuevo: índice del servicio actual
  const [currentService, setCurrentService] = useState(0)
  const autoScrollInterval = 3000 // ms

  const scroll = (direction) => {
    const container = scrollRef.current
    if (!container) return
    const card = container.querySelector('.service-card')
    const cardWidth = card ? card.getBoundingClientRect().width : container.clientWidth / 3
    let newIndex = currentService
    if (direction === 'left') {
      newIndex = (currentService - 1 + listaServicios.length) % listaServicios.length
    } else {
      newIndex = (currentService + 1) % listaServicios.length
    }
    setCurrentService(newIndex)
    container.scrollTo({
      left: newIndex * (cardWidth + 16),
      behavior: 'smooth',
    })
  }

  // Efecto infinito: cuando cambia currentService, si es el último, vuelve al primero automáticamente
  // useEffect ya está importado arriba
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const card = container.querySelector('.service-card')
    const cardWidth = card ? card.getBoundingClientRect().width : container.clientWidth / 3
    container.scrollTo({
      left: currentService * (cardWidth + 16),
      behavior: 'smooth',
    })
  }, [currentService])

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      scroll('right')
    }, autoScrollInterval)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [currentService])

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

  const listaServicios = [
  { id: 1, titulo: "Penal", desc: "Narcotráfico y causas complejas." },
  { id: 2, titulo: "Laboral", desc: "Conflictos y protección del trabajador." },
  { id: 3, titulo: "ART", desc: "Accidentes e incapacidades laborales." },
  { id: 4, titulo: "Civil", desc: "Controversias y reclamos patrimoniales." },
  { id: 5, titulo: "Familia", desc: "Divorcios y medidas urgentes." },
];



  return (
    <main className="home-page">
      <SeoHead
        title="Abogado Penalista | Nicolas Ruades"
        description="Defensa penal profesional, estrategia jurídica y acompañamiento en cada etapa del proceso."
        canonicalPath="/"
        jsonLd={localBusinessJsonLd}
      />

      {/* HERO + BANNER fusionados: imagen/carrusel de fondo, texto superpuesto */}
      <section className="hero-banner-combo fusion">
        {/* Imagen/carrusel de fondo */}
        <div className="hero-banner-bg">
          {desktopSlides.length > 0 ? (
            <div id="homeCarouselDesktop" className="carousel slide desktop-only" data-bs-ride="carousel">
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
              {/* Opcional: controles de carrusel si hay más de uno */}
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
          {/* Overlay oscuro para legibilidad */}
          <div className="hero-banner-overlay" />
        </div>
        {/* Contenido escrito superpuesto */}
        <div className="hero-content left fusion">
          <h1 className="hero-title">Abogado Penalista<br /><span>Nicolás Ruades</span></h1>
          <p className="hero-subtitle">
            Defensa penal estratégica y asesoramiento profesional en causas complejas.<br />
            Córdoba, Argentina
          </p>
          <a href="#servicios" className="hero-cta-btn">Conocé nuestros servicios</a>
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

      {/* --- SECCIÓN QUIÉNES SOMOS RENOVADA (2 COLUMNAS) --- */}
<section className="home-section who-are-we-section">
  <div className="who-are-we-grid">
    
    {/* COLUMNA 1: IMAGEN (IZQUIERDA) */}
    <div className="who-image-column">
      <div className="who-image-wrapper">
        {/* REEMPLAZA ESTA URL POR LA FOTO DE NICOLÁS O UNA FOTO DE ARCHIVO */}
        <img 
          src={nicolasRuadesImg}
          alt="Abogado Nicolás Ruades - Estudio Jurídico ANR & Assoc" 
          className="who-image"
        />
        {/* Un detalle elegante: marco dorado sutil */}
        <div className="who-image-frame"></div>
      </div>
    </div>

    {/* COLUMNA 2: TEXTO DIVIDIDO (DERECHA) */}
    <div className="who-text-column">
      {/* Título resaltado en dorado */}
      <h2 className="who-title">Quiénes <span>Somos</span></h2>
      
      <div className="who-paragraphs">
        <p className="who-lead">
          Somos una firma legal moderna y dinámica liderada por el <strong>Abg. Nicolás Ruades</strong>, dedicada a brindar soluciones integrales con un enfoque en la excelencia y la transparencia.
        </p>
        
        <p>
          Nos especializamos en diversas áreas del derecho (<strong>Penal</strong>, laboral, ART, Derecho de familia, Accidentes de transito, ejecuciones), combinando una sólida formación técnica con un trato humano y personalizado.
        </p>
        
        {/* Párrafo de Misión resaltado */}
        <p className="who-mission">
          Nuestra misión es proteger tus intereses y garantizar una representación firme, profesional y confiable en cada etapa del proceso judicial.
        </p>
      </div>
    </div>

  </div>
</section>

      {/* --- SECCIÓN SERVICIOS (SCROLL HORIZONTAL) --- */}
<section className="services-slider-section">
  <div className="services-slider-container">
    
    {/* Reutilizamos la idea de tu 'hero-content' para el título fijo */}
    <div className="services-intro">
      <h2 className="services-title">Servicios que <span>brindamos</span></h2>
      <div className="services-divider"></div>
      
      {/* Botones: Reutilizamos la lógica de tus 'carousel-control' pero con tus funciones */}
      <div className="services-navigation">
        <button className="nav-btn-custom styled-arrow left" onClick={() => scroll('left')} aria-label="Servicio anterior">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="#C9A14A" strokeWidth="2" fill="#fff" />
            <path d="M19 10L13 16L19 22" stroke="#C9A14A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="nav-btn-custom styled-arrow right" onClick={() => scroll('right')} aria-label="Servicio siguiente">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="#C9A14A" strokeWidth="2" fill="#fff" />
            <path d="M13 10L19 16L13 22" stroke="#C9A14A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    {/* El track donde se hace el .map() igual que hiciste con el Banner */}
    <div className="services-track" ref={scrollRef}>
      {listaServicios.map((servicio) => (
        <div key={servicio.id} className="service-card">
          <h3>{servicio.titulo}</h3>
          <p>{servicio.desc}</p>
          <button className="service-btn">Saber más →</button>
        </div>
      ))}
    </div>
    
  </div>
</section>

      {/* --- SECCIÓN TESTIMONIOS DE CLIENTES --- */}
      <section className="home-section testimonials-section">
        <div className="testimonials-grid">
          {/* COLUMNA IZQUIERDA: TARJETAS DE RESEÑAS */}
          <div className="testimonials-cards" ref={scrollRef}>
            {reviews.map((review, index) => (
                <div key={index} className="testimonial-card">
                  {/* 1. NOMBRE ARRIBA */}
                  <p className="testimonial-author-top">{review.author_name}</p>

                  <div className="testimonial-header">
                    {/* 2. ESTRELLAS ABAJO DEL NOMBRE */}
                    <div className="testimonial-stars">{ratingStars(review.rating)}</div>
                    {/* Título opcional, si la reseña de Maps tiene título */}
                    {review.title && <h3 className="testimonial-title">{review.title}</h3>}
                  </div>

                  {/* 3. CONTENIDO DE LA RESEÑA */}
                  <p className="testimonial-content">{review.content}</p>

                  {/* 4. LINK A GOOGLE MAPS */}
                  {review.review_url && (
                    <a 
                      href={review.review_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="testimonial-maps-link"
                    >
                      Ver en Google Maps →
                    </a>
                  )}
                </div>
              ))}
          </div>

          {/* COLUMNA DERECHA: TEXTO ESTÁTICO */}
          <div className="testimonials-text">
            <h2 className="testimonials-title">Clientes <span>Satisfechos</span> respaldan nuestro trabajo</h2>
            <p className="testimonials-description">
              Experiencias reales de clientes que confiaron su defensa al estudio.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
