import { Navigate, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'

import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'

import AdminDashboardPage from './features/admin/pages/AdminDashboardPage'
import LoginAdminPage from './features/admin/pages/LoginAdminPage'

import HomePage from './features/home/pages/HomePage'
import AboutPage from './features/about/pages/AboutPage'
import NewsPage from './features/news/pages/NewsPage'
import NewsDetailPage from './features/news/pages/NewsDetailPage'

import PrivateRoute from './shared/components/PrivateRoute'

function App() {
  return (
    <HelmetProvider>
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
    </HelmetProvider>
  )
}

export default App