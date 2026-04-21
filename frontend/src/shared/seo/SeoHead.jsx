import { Helmet } from 'react-helmet-async'

function SeoHead({
  title,
  description,
  canonicalPath = '/',
  image = '/uploads/banners/seo-default.jpg',
  jsonLd,
}) {
  const siteBase = (import.meta.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
  const canonicalUrl = `${siteBase}${canonicalPath}`
  const imageUrl = image.startsWith('http') ? image : `${siteBase}${image}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  )
}

export default SeoHead
