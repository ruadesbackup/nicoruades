import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoImg from '../assets/Logo.png'

import '../hamburger-menu.css'

function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  // 🔐 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token')
    setMenuOpen(false)
    navigate('/admin/login')
  }

  // Sticky navbar
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
            <Link to="/" className="brand-logo" onClick={() => setMenuOpen(false)}>
              <img src={logoImg} alt="Logo Estudio de Abogacía ANR & ASOC" width={66} height={44} />
            </Link>
            <span className="brand-title">
              ESTUDIO DE ABOGACIA
              <br />
              ANR & ASOC
            </span>
          </div>

          {/* ☰ / X */}
          {!menuOpen ? (
            <button className="hamburger" onClick={() => setMenuOpen(true)}>
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </button>
          ) : (
            <button className="close-menu-btn" onClick={() => setMenuOpen(false)}>
              ✕
            </button>
          )}

          <nav className={`public-nav${menuOpen ? ' open' : ''}`}>
            <NavLink to="/" className="public-nav-link" onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>

            <NavLink to="/noticias" className="public-nav-link" onClick={() => setMenuOpen(false)}>
              Noticias
            </NavLink>

            <NavLink to="/nosotros" className="public-nav-link" onClick={() => setMenuOpen(false)}>
              Nosotros
            </NavLink>

            {/* 🔐 LOGOUT */}
            <button className="nav-logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar sesión
            </button>

          </nav>
        </div>
      </header>

      <div className="public-content-container">
        {children}
      </div>

      <footer className="public-footer glass">
  <div className="public-footer-inner">

    <div className="footer-brand">

      <div className="footer-logo-box">
        <img
          src={logoImg}
          alt="Logo Estudio de Abogacía ANR & ASOC"
          className="footer-logo-img"
          width={54}
          height={36}
        />
      </div>

      <div className="footer-brand-text">
        <span className="footer-brand-title">ESTUDIO DE ABOGACIA</span>
        <span className="footer-brand-subtitle">ANR & ASOC</span>
      </div>

    </div>

    <nav className="footer-nav" aria-label="Navegación del pie">
      <NavLink to="/" className="footer-nav-link">Inicio</NavLink>
      <NavLink to="/noticias" className="footer-nav-link">Noticias</NavLink>
      <NavLink to="/nosotros" className="footer-nav-link">Nosotros</NavLink>
      <NavLink to="/admin" className="footer-nav-link">Admin</NavLink>
    </nav>

    <div className="footer-contact">
      <p className="footer-contact-text">
        Estudio Jurídico Penal · Atención profesional y estratégica.
      </p>
      <p className="footer-copyright">
        © {new Date().getFullYear()} Estudio Jurídico Nicolas Ruades. Todos los derechos reservados.
      </p>
    </div>

  </div>
</footer>
    </div>
  )
}

export default AdminLayout