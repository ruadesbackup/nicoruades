import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'

import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'

import PrivateRoute from './shared/components/PrivateRoute'

const HomePage = lazy(() => import('./features/home/pages/HomePage'))
const AboutPage = lazy(() => import('./features/about/pages/AboutPage'))
const NewsPage = lazy(() => import('./features/news/pages/NewsPage'))
const NewsDetailPage = lazy(() => import('./features/news/pages/NewsDetailPage'))
const LoginAdminPage = lazy(() => import('./features/admin/pages/LoginAdminPage'))
const AdminDashboardPage = lazy(() => import('./features/admin/pages/AdminDashboardPage'))

function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hostname = window.location.hostname
    const productionHost = 'www.nicolasruades.com.ar'

    if (hostname.endsWith('.vercel.app') && hostname !== productionHost) {
      const targetUrl = `https://${productionHost}${window.location.pathname}${window.location.search}${window.location.hash}`
      window.location.replace(targetUrl)
    }
  }, [])

  return (
    <HelmetProvider>
      <Suspense
        fallback={
          <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', padding: '2rem', color: '#dce5f2' }}>
            Cargando contenido...
          </div>
        }
      >
        <Routes>

          {/* 🌐 PUBLICAS */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
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

          {/* 🔐 LOGIN ADMIN */}
          <Route
            path="/admin/login"
            element={
              !localStorage.getItem('token') ? (
                <PublicLayout>
                  <LoginAdminPage />
                </PublicLayout>
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          {/* 🔐 ADMIN PROTEGIDO */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          {/* 🚫 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </HelmetProvider>
  )
}

export default App