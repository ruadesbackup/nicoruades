const express = require('express');
const newsController = require('../controllers/newsController');
const uploadNewsMedia = require('../middlewares/uploadNewsMedia');

const router = express.Router();

router.get('/', newsController.searchNews);
router.get('/:slug', newsController.getNewsBySlug);
router.get('/:id', newsController.getNewsById);
router.post('/', uploadNewsMedia, newsController.createNews);
router.put('/:id', uploadNewsMedia, newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;
