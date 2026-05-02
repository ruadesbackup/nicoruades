import { useState } from 'react'
import NewsAdminPage from '../news/pages/NewsAdminPage'
import GoogleReviewsAdminPage from '../reviews/pages/GoogleReviewsAdminPage'
import CarouselAdminPage from '../carousel/pages/CarouselAdminPage'

function AdminDashboardPage() {
  const [activeModule, setActiveModule] = useState('news')

  return (
    <>
      <section className="module-switch" aria-label="Selección de módulo">
  <div className="module-switch-card">

    <button
      type="button"
      className={`module-btn ${activeModule === 'news' ? 'active' : ''}`}
      onClick={() => setActiveModule('news')}
    >
      Noticias
    </button>

    <button
      type="button"
      className={`module-btn ${activeModule === 'carousel' ? 'active' : ''}`}
      onClick={() => setActiveModule('carousel')}
    >
      Banners Home
    </button>

    <button
      type="button"
      className={`module-btn ${activeModule === 'reviews' ? 'active' : ''}`}
      onClick={() => setActiveModule('reviews')}
    >
      Reseñas
    </button>

  </div>
</section>

      {activeModule === 'news' ? <NewsAdminPage /> : null}
      {activeModule === 'carousel' ? <CarouselAdminPage /> : null}
      {activeModule === 'reviews' ? <GoogleReviewsAdminPage /> : null}
    </>
  )
}

export default AdminDashboardPage
