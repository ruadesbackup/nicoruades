import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoImg from '../assets/Logo.png'

function PublicLayout({ children }) {
  // Sticky navbar con opacidad dinámica al hacer scroll
  useEffect(() => {
    const header = document.querySelector('.public-header')
    const onScroll = () => {
      if (window.scrollY > 24) {
        header?.classList.add('scrolled')
      } else {
        header?.classList.remove('scrolled')
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="public-shell">
      <header className="public-header glass">
        <div className="public-header-inner public-marquina-surface">
          <div className="brand-group">
            <Link to="/" className="brand-logo" aria-label="Inicio">
              <img src={logoImg} alt="Logo Estudio de Abogacía ANR & ASOC" className="brand-logo-img" height={44} />
            </Link>
            <span className="brand-title">
              ESTUDIO DE ABOGACIA
              <br />
              ANR & ASOC
            </span>
          </div>

          <nav className="public-nav" aria-label="Navegación principal">
            <NavLink to="/" end className="public-nav-link">
              Inicio
            </NavLink>
            <NavLink to="/noticias" className="public-nav-link">
              Noticias
            </NavLink>
            <NavLink to="/nosotros" className="public-nav-link">
              Nosotros
            </NavLink>
            <NavLink to="/admin" className="public-nav-link">
              Administración
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="public-content-container">
        {children}
      </div>

      <footer className="public-footer glass">
        <div className="public-footer-inner">
          <div className="footer-brand">
            <img src={logoImg} alt="Logo Estudio de Abogacía ANR & ASOC" className="footer-logo-img" height={36} />
            <div className="footer-brand-text">
              <span className="footer-brand-title">ESTUDIO DE ABOGACIA</span>
              <span className="footer-brand-subtitle">ANR & ASOC</span>
            </div>
          </div>
          
          <nav className="footer-nav" aria-label="Navegación del pie">
            <NavLink to="/" className="footer-nav-link">
              Inicio
            </NavLink>
            <NavLink to="/noticias" className="footer-nav-link">
              Noticias
            </NavLink>
            <NavLink to="/nosotros" className="footer-nav-link">
              Nosotros
            </NavLink>
          </nav>
          
          <div className="footer-contact">
            <p className="footer-contact-text">Estudio Jurídico Penal · Atención profesional y estratégica.</p>
            <p className="footer-copyright">© {new Date().getFullYear()} Estudio Jurídico Nicolas Ruades. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
