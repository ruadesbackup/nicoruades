const express = require('express');
const carouselController = require('../controllers/carouselController');
const uploadCarouselMedia = require('../middlewares/uploadCarouselMedia');
const requireAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', carouselController.listCarousel);
router.get('/:id', carouselController.getCarouselById);
router.post('/', requireAuth, uploadCarouselMedia, carouselController.createCarousel);
router.put('/:id', requireAuth, uploadCarouselMedia, carouselController.updateCarousel);
router.delete('/:id', requireAuth, carouselController.deleteCarousel);

module.exports = router;
