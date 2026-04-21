import { useState } from 'react'
import NewsAdminPage from '../news/pages/NewsAdminPage'
import GoogleReviewsAdminPage from '../reviews/pages/GoogleReviewsAdminPage'
import CarouselAdminPage from '../carousel/pages/CarouselAdminPage'

function AdminDashboardPage() {
  const [activeModule, setActiveModule] = useState('news')

  return (
    <>
      <section className="module-switch" aria-label="Selección de módulo">
        <button
          type="button"
          className={`btn btn-sm ${activeModule === 'news' ? 'btn-primary' : 'btn-outline-light'}`}
          onClick={() => setActiveModule('news')}
        >
          Noticias
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeModule === 'carousel' ? 'btn-primary' : 'btn-outline-light'}`}
          onClick={() => setActiveModule('carousel')}
        >
          Banners Home
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeModule === 'reviews' ? 'btn-primary' : 'btn-outline-light'}`}
          onClick={() => setActiveModule('reviews')}
        >
          Reseñas
        </button>
      </section>

      {activeModule === 'news' ? <NewsAdminPage /> : null}
      {activeModule === 'carousel' ? <CarouselAdminPage /> : null}
      {activeModule === 'reviews' ? <GoogleReviewsAdminPage /> : null}
    </>
  )
}

export default AdminDashboardPage
