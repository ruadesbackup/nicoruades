const express = require('express');
const newsController = require('../controllers/newsController');
const uploadNewsMedia = require('../middlewares/uploadNewsMedia');
const requireAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', newsController.searchNews);
router.get('/:slug', newsController.getNewsBySlug);
router.get('/:id', newsController.getNewsById);
router.post('/', requireAuth, uploadNewsMedia, newsController.createNews);
router.put('/:id', requireAuth, uploadNewsMedia, newsController.updateNews);
router.delete('/:id', requireAuth, newsController.deleteNews);

module.exports = router;
