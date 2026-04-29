
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SeoHead from '../../../shared/seo/SeoHead';
import { apiClient } from '../../../shared/services/apiClient';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import './NewsDetailPage.css';

function resolveMediaUrl(pathname) {
  if (!pathname) return '';
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');
  return pathname.startsWith('http') ? pathname : `${base}${pathname}`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiClient
      .get(`/noticias/${slug}`)
      .then((res) => setNews(res.data?.data || null))
      .catch(() => setError('No se pudo cargar la noticia.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="news-detail-loading">Cargando noticia...</div>;
  }
  if (error) {
    return <div className="news-detail-error">{error}</div>;
  }
  if (!news) {
    return <div className="news-detail-empty">No se encontró la noticia.</div>;
  }


  // Convertir Markdown a HTML seguro
  const htmlContent = DOMPurify.sanitize(marked.parse(news.content || ''));

  return (
    <main className="news-detail-page">
      <SeoHead
        title={news.title}
        description={news.content?.replace(/[#*_`>\-\n]/g, '').slice(0, 160) || news.title}
        canonicalPath={`/noticias/${news.slug}`}
        image={news.img_desktop ? resolveMediaUrl(news.img_desktop) : undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: news.title,
          datePublished: news.created_at,
          image: news.img_desktop ? resolveMediaUrl(news.img_desktop) : undefined,
          url: `/noticias/${news.slug}`,
          description: news.content?.replace(/[#*_`>\-\n]/g, '').slice(0, 160),
        }}
      />
      <article className="news-detail-article">
        {news.img_desktop && (
          <div className="news-detail-image-wrapper">
            <img
              src={resolveMediaUrl(news.img_desktop)}
              alt={news.title}
              className="news-detail-image"
              loading="lazy"
            />
          </div>
        )}
        <h1 className="news-detail-title">{news.title}</h1>
        <div className="news-detail-date">{formatDate(news.created_at)}</div>

        <div
          className="news-detail-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {news.external_url && (
          <a
            href={news.external_url}
            className="news-detail-external-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver noticia completa ↗
          </a>
        )}
      </article>
    </main>
  );
}