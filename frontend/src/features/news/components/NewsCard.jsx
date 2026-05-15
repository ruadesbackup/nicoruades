import './NewsCard.css'

function NewsCard({ image, title, preview, link }) {
  return (
    <article className="news-card">
      <div className="news-card-image-wrapper">
        <img src={image} alt={title} className="news-card-image" width={1200} height={675} loading="lazy" decoding="async" />
      </div>
      <div className="news-card-content">
        <h3 className="news-card-title">{title}</h3>
        <p className="news-card-preview">{preview}</p>
        <a href={link} className="news-card-link" aria-label={`Leer más sobre ${title}`}>
          Ver más →
        </a>
      </div>
    </article>
  )
}

export default NewsCard
