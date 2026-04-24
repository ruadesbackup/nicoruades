import { useEffect, useState } from 'react'
import SeoHead from '../../../shared/seo/SeoHead'
import { apiClient } from '../../../shared/services/apiClient'
import './NewsPage.css'

function resolveMediaUrl(pathname) {
  if (!pathname) return ''
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '')
  return pathname.startsWith('http') ? pathname : `${base}${pathname}`
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient
      .get('/noticias', { params: { limit: 12 } })
      .then((res) => setNews(res.data?.data || []))
      .catch((err) => setError('No se pudieron cargar las noticias.'))
      .finally(() => setLoading(false))
  }, [])

  const newsListJsonLd = news.map((item) => ({
    '@type': 'NewsArticle',
    headline: item.title,
    datePublished: item.created_at,
    image: item.img_desktop ? resolveMediaUrl(item.img_desktop) : undefined,
    url: `/noticias/${item.slug}`,
    description: item.content?.slice(0, 160),
  }))

  return (
    <main className="news-page">
      <SeoHead
        title="Noticias legales y novedades | Estudio Jurídico Nicolas Ruades"
        description="Últimas noticias, novedades y artículos legales del Estudio Jurídico Nicolas Ruades."
        canonicalPath="/noticias"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: newsListJsonLd,
        }}
      />
      <section className="news-hero">
        <h1>Noticias y Novedades</h1>
        <p className="news-lead">Actualidad jurídica, novedades del estudio y artículos de interés.</p>
      </section>
      <section className="news-list" aria-label="Listado de noticias">
        {loading && <div className="news-loading">Cargando noticias...</div>}
        {error && <div className="news-error">{error}</div>}
        {!loading && !error && news.length === 0 && <div className="news-empty">No hay noticias disponibles.</div>}
        {!loading && !error && news.length > 0 && (
          <ul className="news-cards">
            {news.map((item) => (
              <li key={item.news_id} className="news-card">
                {item.img_desktop && (
                  <img
                    src={resolveMediaUrl(item.img_desktop)}
                    alt={item.title}
                    className="news-card-img"
                    loading="lazy"
                  />
                )}
                <div className="news-card-content">
                  <h2 className="news-card-title">{item.title}</h2>
                  <p className="news-card-date">{formatDate(item.created_at)}</p>
                  <p className="news-card-desc">{item.content?.slice(0, 160)}...</p>
                  {/* Si se implementa detalle, usar <Link> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
