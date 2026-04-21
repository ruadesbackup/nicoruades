import { Link, NavLink } from 'react-router-dom'

function PublicLayout({ children }) {
  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-header-inner public-marquina-surface">
          <Link to="/" className="brand-mark" aria-label="Inicio">
            Nicolas Ruades
          </Link>

          <nav className="public-nav" aria-label="Navegación principal">
            <NavLink to="/" end className="public-nav-link">
              Inicio
            </NavLink>
            <NavLink to="/admin" className="public-nav-link">
              Administración
            </NavLink>
          </nav>
        </div>
      </header>

      {children}

      <footer className="public-footer">
        <div className="public-footer-inner public-marquina-surface">
          <p>Estudio Jurídico Penal · Atención profesional y estratégica.</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
