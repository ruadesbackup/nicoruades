import { Navigate, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'
import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage'
import LoginAdminPage from './features/admin/pages/LoginAdminPage'
import { isAuthenticated } from './shared/services/auth'
import HomePage from './features/home/pages/HomePage'
import AboutPage from './features/about/pages/AboutPage'
import NewsPage from './features/news/pages/NewsPage'
import NewsDetailPage from './features/news/pages/NewsDetailPage'

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />

        <Route
          path="/admin"
          element={
            isAuthenticated() ? (
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        <Route
          path="/admin/login"
          element={
            <PublicLayout>
              <LoginAdminPage />
            </PublicLayout>
          }
        />

        <Route
          path="/nosotros"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />


        <Route
          path="/noticias"
          element={
            <PublicLayout>
              <NewsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/noticias/:slug"
          element={
            <PublicLayout>
              <NewsDetailPage />
            </PublicLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HelmetProvider>
  )
}

export default App
