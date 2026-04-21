const path = require('path');
const express = require('express');
const cors = require('cors');

const newsRoutes = require('./routes/newsRoutes');
const carouselRoutes = require('./routes/carouselRoutes');
const googleReviewsRoutes = require('./routes/googleReviewsRoutes');
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
			health: '/health',
			news: '/api/noticias',
			carousel: '/api/carousel',
			googleReviews: '/api/google-reviews',
		},
	});
});

app.get('/health', (_req, res) => {
	res.json({ ok: true, message: 'Backend operativo' });
});

app.use('/api/noticias', newsRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/google-reviews', googleReviewsRoutes);

app.use(errorHandler);

module.exports = app;
