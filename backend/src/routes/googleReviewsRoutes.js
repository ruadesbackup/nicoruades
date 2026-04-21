const express = require('express');
const googleReviewsController = require('../controllers/googleReviewsController');

const router = express.Router();

router.get('/public', googleReviewsController.listPublicVisibleReviews);
router.get('/', googleReviewsController.searchReviews);
router.get('/:id', googleReviewsController.getReviewById);
router.post('/', googleReviewsController.createReview);
router.put('/:id', googleReviewsController.updateReview);
router.patch('/:id/visibility', googleReviewsController.updateReviewVisibility);
router.delete('/:id', googleReviewsController.deleteReview);

module.exports = router;