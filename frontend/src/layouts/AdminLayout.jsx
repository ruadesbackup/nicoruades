function AdminLayout({ children }) {
  return (
    <div className="admin-layout-shell">
      <header className="topbar">
        <div>
          <h2>Panel de administración</h2>
        </div>
      </header>
      {children}
    </div>
  )
}

export default AdminLayout