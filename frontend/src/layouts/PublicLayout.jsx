import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoImg from '../assets/Logo.png'

import '../hamburger-menu.css'

function PublicLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
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
      {/* Overlay para cerrar menú */}

      <header className="public-header glass">
        <div className="public-header-inner public-marquina-surface">
          <div className="brand-group">
            <Link to="/" className="brand-logo" aria-label="Inicio" onClick={() => setMenuOpen(false)}>
              <img src={logoImg} alt="Logo Estudio de Abogacía ANR & ASOC" className="brand-logo-img" height={44} />
            </Link>
            <span className="brand-title">
              ESTUDIO DE ABOGACIA
              <br />
              ANR & ASOC
            </span>
          </div>

          {/* Botón hamburguesa y cerrar */}
          {!menuOpen && (
            <button className="hamburger" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="public-nav" onClick={() => setMenuOpen(true)}>
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </button>
          )}
          {menuOpen && (
            <button className="close-menu-btn" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="10" x2="26" y2="26" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="26" y1="10" x2="10" y2="26" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <nav
            id="public-nav"
            className={`public-nav${menuOpen ? ' open' : ''}`}
            aria-label="Navegación principal"
          >
            <NavLink to="/" end className="public-nav-link" onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
            <NavLink to="/noticias" className="public-nav-link" onClick={() => setMenuOpen(false)}>
              Noticias
            </NavLink>
            <NavLink to="/nosotros" className="public-nav-link" onClick={() => setMenuOpen(false)}>
              Nosotros
            </NavLink>
            <NavLink to="/admin" className="public-nav-link" onClick={() => setMenuOpen(false)}>
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
