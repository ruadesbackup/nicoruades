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
              <img src={logoImg} alt="Logo Estudio de Abogacía ANR & ASOC" height={44} />
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
            <img src={logoImg} alt="Logo" height={36} />
            <div>
              <span>ESTUDIO DE ABOGACIA</span>
              <br />
              <span>ANR & ASOC</span>
            </div>
          </div>

          <nav className="footer-nav">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/noticias">Noticias</NavLink>
            <NavLink to="/nosotros">Nosotros</NavLink>

            <NavLink to="/admin">Admin</NavLink>
          </nav>

          <div>
            <p>Estudio Jurídico Penal · Atención profesional y estratégica.</p>
            <p>© {new Date().getFullYear()} Nicolas Ruades</p>
          </div>

        </div>
      </footer>
    </div>
  )
}

export default AdminLayout