import { useRef, useState, useEffect } from 'react'
import SeoHead from '../../../shared/seo/SeoHead'
import { useHomeData } from '../hooks/useHomeData'
import googleLogo from '../../../assets/google.webp'
import './HomePage.css'
import nicolasRuadesImg from '../../../assets/perfil/NicolasRuadesHome1.jpg'
import { Link } from 'react-router-dom';

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
  const [brokenAvatarMap, setBrokenAvatarMap] = useState({})
  const [currentSlide, setCurrentSlide] = useState(0)
  const serviceCardRefs = useRef([])
  const testimonialCardRefs = useRef([])
  
  // 1. REFERENCIAS DIFERENTES (Vital para que no se pise el scroll)
  const reviewsScrollerRef = useRef(null)
  const servicesScrollerRef = useRef(null) // <--- Cambiamos nombre por claridad
  
  // 2. ESTADOS
  const [currentService, setCurrentService] = useState(0)
  const [currentReview, setCurrentReview] = useState(0)
  const autoScrollInterval = 3000

  useEffect(() => {
    setCurrentSlide(0)
  }, [carouselSlides.length])

  useEffect(() => {
    if (carouselSlides.length <= 1) return

    const timer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % carouselSlides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [carouselSlides.length])

  // 3. LISTA DE SERVICIOS (debe estar antes de los useEffect que la usan)
  const listaServicios = [
    { id: 1, titulo: "Penal", desc: "Narcotráfico y causas complejas." },
    { id: 2, titulo: "Laboral", desc: "Conflictos y protección del trabajador." },
    { id: 3, titulo: "ART", desc: "Accidentes e incapacidades laborales." },
    { id: 4, titulo: "Civil", desc: "Controversias y reclamos patrimoniales." },
    { id: 5, titulo: "Familia", desc: "Divorcios y medidas urgentes." },
  ];

  // 4. LÓGICA DE SERVICIOS (Corregida)
  const scrollServices = (direction) => {
    let newIndex
    if (direction === 'left') {
      newIndex = (currentService - 1 + listaServicios.length) % listaServicios.length
    } else {
      newIndex = (currentService + 1) % listaServicios.length
    }
    
    setCurrentService(newIndex)
  }

  // 5. AUTO-SCROLL (Separado para evitar el bucle infinito)
  useEffect(() => {
    const timer = setInterval(() => {
      // Usamos la lógica directamente aquí para evitar dependencias circulares
      setCurrentService((prev) => (prev + 1) % listaServicios.length)
    }, autoScrollInterval)
    
    return () => clearInterval(timer)
  }, [listaServicios.length]) // Solo depende del largo de la lista

  // 6. SINCRONIZACIÓN DEL SCROLL
  useEffect(() => {
    const container = servicesScrollerRef.current
    if (!container) return
    const targetCard = serviceCardRefs.current[currentService]
    if (!targetCard) return

    container.scrollTo({
      left: targetCard.offsetLeft,
      behavior: 'smooth',
    })
  }, [currentService])

  // 6. AUTO-SCROLL DE REVIEWS
  useEffect(() => {
    if (!reviews || reviews.length === 0) return
    
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, autoScrollInterval)
    
    return () => clearInterval(timer)
  }, [reviews.length])

  // 7. SINCRONIZACIÓN DEL SCROLL DE REVIEWS
  useEffect(() => {
    const container = reviewsScrollerRef.current
    if (!container) return

    const targetCard = testimonialCardRefs.current[currentReview]
    if (!targetCard) return

    container.scrollTo({
      left: targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2,
      behavior: 'smooth',
    })
  }, [currentReview])

  // 8. LÓGICA DE REVIEWS (Se mantiene igual, independiente)
  const scrollReviews = (direction) => {
    if (!reviews.length) return
    setCurrentReview((current) => {
      const nextIndex = (current + direction + reviews.length) % reviews.length
      return nextIndex
    })
  }

  const goToPreviousSlide = () => {
    if (carouselSlides.length <= 1) return
    setCurrentSlide((current) => (current - 1 + carouselSlides.length) % carouselSlides.length)
  }

  const goToNextSlide = () => {
    if (carouselSlides.length <= 1) return
    setCurrentSlide((current) => (current + 1) % carouselSlides.length)
  }

  const setServiceCardRef = (index) => (element) => {
    serviceCardRefs.current[index] = element
  }

  const setTestimonialCardRef = (index) => (element) => {
    testimonialCardRefs.current[index] = element
  }

  // ... (markAvatarAsBroken y jsonLd se mantienen igual)

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

      {/* HERO + BANNER fusionados: imagen/carrusel de fondo, texto superpuesto */}
        <section className="hero-banner-combo fusion">
          {/* Imagen/carrusel de fondo SOLO DESKTOP */}
          <div className="hero-banner-bg">
            {carouselSlides.length > 0 ? (
              <div className="home-carousel" aria-roledescription="carousel" aria-label="Banner principal">
                {carouselSlides.map((slide, index) => (
                  <article
                    key={`desktop-item-${slide.carousel_id}`}
                    className={`home-carousel-slide${index === currentSlide ? ' is-active' : ''}`}
                    aria-hidden={index !== currentSlide}
                  >
                    <picture>
                      <source media="(max-width: 767px)" srcSet={slide.imgMobileUrl || slide.imgDesktopUrl} />
                      <img
                        src={slide.imgDesktopUrl}
                        className="home-carousel-image"
                        alt={`Banner legal desktop ${index + 1}`}
                        width={1200}
                        height={675}
                        loading={index === currentSlide ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </picture>
                  </article>
                ))}

                {carouselSlides.length > 1 ? (
                  <>
                    <button
                      className="home-carousel-control home-carousel-control-prev"
                      type="button"
                      onClick={goToPreviousSlide}
                      aria-label="Slide anterior"
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                    <button
                      className="home-carousel-control home-carousel-control-next"
                      type="button"
                      onClick={goToNextSlide}
                      aria-label="Slide siguiente"
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="hero-banner-placeholder" aria-hidden="true" />
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
          width={521}
          height={782}
          loading="lazy"
          decoding="async"
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
<section id="servicios" className="services-slider-section">
  <div className="services-slider-container">
    
    {/* Reutilizamos la idea de tu 'hero-content' para el título fijo */}
    <div className="services-intro">
      <h2 className="services-title">Servicios que <span>brindamos</span></h2>
      <div className="services-divider"></div>
      
      {/* Botones: Reutilizamos la lógica de tus 'carousel-control' pero con tus funciones */}
      <div className="services-navigation">
        <button className="nav-btn-custom styled-arrow left" onClick={() => scrollServices('left')} aria-label="Servicio anterior">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="#C9A14A" strokeWidth="2" fill="#fff" />
            <path d="M19 10L13 16L19 22" stroke="#C9A14A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="nav-btn-custom styled-arrow right" onClick={() => scrollServices('right')} aria-label="Servicio siguiente">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="#C9A14A" strokeWidth="2" fill="#fff" />
            <path d="M13 10L19 16L13 22" stroke="#C9A14A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    {/* El track donde se hace el .map() igual que hiciste con el Banner */}
  <div className="services-track" ref={servicesScrollerRef}>
  {listaServicios.map((servicio) => (
    <div key={servicio.id} className="service-card" ref={setServiceCardRef(servicio.id - 1)}>
      <h3>{servicio.titulo}</h3>
      <p>{servicio.desc}</p>
      
      {/* Usamos Link para navegación interna y onClick para asegurar el scroll al inicio */}
      <Link 
        to="/nosotros" 
        className="service-btn"
        onClick={() => window.scrollTo(0, 0)}
      >
        Saber más →
      </Link>
    </div>
  ))}
</div>
    
  </div>
</section>

      {/* --- SECCIÓN TESTIMONIOS DE CLIENTES --- */}
      <section className="home-section testimonials-section">
        <div className="testimonials-grid">
          {/* COLUMNA IZQUIERDA: TARJETAS DE RESEÑAS */}
          <div className="testimonials-cards" ref={reviewsScrollerRef}>
            {reviews?.map((review, index) => (
                <div key={index} className="testimonial-card" ref={setTestimonialCardRef(index)}>
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
