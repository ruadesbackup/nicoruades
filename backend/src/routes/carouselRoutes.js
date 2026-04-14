const express = require('express');
const carouselController = require('../controllers/carouselController');
const uploadCarouselMedia = require('../middlewares/uploadCarouselMedia');

const router = express.Router();

router.get('/', carouselController.listCarousel);
router.get('/:id', carouselController.getCarouselById);
router.post('/', uploadCarouselMedia, carouselController.createCarousel);
router.put('/:id', uploadCarouselMedia, carouselController.updateCarousel);
router.delete('/:id', carouselController.deleteCarousel);

module.exports = router;
