const path = require('path');
const express = require('express');
const cors = require('cors');

const newsRoutes = require('./routes/newsRoutes');
const carouselRoutes = require('./routes/carouselRoutes');
const googleReviewsRoutes = require('./routes/googleReviewsRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.get('/', (_req, res) => {
	res.json({
		ok: true,
		message: 'Backend Nicolas Ruades operativo',
		endpoints: {
			health: '/api/health',
			news: '/api/noticias',
			carousel: '/api/carousel',
			googleReviews: '/api/google-reviews',
		},
	});
});

const pool = require('./config/db');

// Utilidad para construir URLs absolutas
const BASE_URL = process.env.BASE_URL || 'https://www.nicolasruades.com.ar';

// Endpoint dinámico para sitemap.xml
app.get('/sitemap.xml', async (_req, res) => {
	try {
		// Obtener noticias desde la base de datos
		const [noticias] = await pool.query('SELECT id, slug, updated_at FROM noticias WHERE publicada = 1');

		// Construir URLs de noticias
		const noticiasUrls = noticias.map(noticia => `    <url>\n      <loc>${BASE_URL}/noticias/${noticia.slug || noticia.id}</loc>\n      <lastmod>${noticia.updated_at ? new Date(noticia.updated_at).toISOString().split('T')[0] : ''}</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.8</priority>\n    </url>`).join('\n');

		// Otras URLs principales
		const staticUrls = [
			{ loc: `${BASE_URL}/`, priority: '1.0' },
			{ loc: `${BASE_URL}/noticias`, priority: '0.9' },
			{ loc: `${BASE_URL}/about`, priority: '0.7' },
			{ loc: `${BASE_URL}/carousel`, priority: '0.6' },
		].map(u => `    <url>\n      <loc>${u.loc}</loc>\n      <changefreq>weekly</changefreq>\n      <priority>${u.priority}</priority>\n    </url>`).join('\n');

		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls}\n${noticiasUrls}\n</urlset>`;
		res.header('Content-Type', 'application/xml');
		res.send(sitemap);
	} catch (error) {
		console.error('Error generando sitemap:', error);
		res.status(500).send('Error generando sitemap: ' + error.message);
	}
});
app.get('/api/health', async (_req, res) => {
	try {
		// Consulta mínima para mantener activa la conexión
		await pool.query('SELECT 1');
		res.json({ ok: true, message: 'Backend operativo' });
	} catch (error) {
		res.status(500).json({ ok: false, message: 'Error de conexión a la base de datos', error: error.message });
	}
});

app.use('/api/noticias', newsRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/google-reviews', googleReviewsRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
