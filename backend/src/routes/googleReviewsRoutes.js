const express = require('express');
const googleReviewsController = require('../controllers/googleReviewsController');
const requireAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/public', googleReviewsController.listPublicVisibleReviews);
router.get('/', googleReviewsController.searchReviews);
router.get('/:id', googleReviewsController.getReviewById);
router.post('/', requireAuth, googleReviewsController.createReview);
router.put('/:id', requireAuth, googleReviewsController.updateReview);
router.patch('/:id/visibility', requireAuth, googleReviewsController.updateReviewVisibility);
router.delete('/:id', requireAuth, googleReviewsController.deleteReview);

module.exports = router;