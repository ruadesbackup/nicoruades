const googleReviewsService = require('../services/googleReviewsService');

function parseReviewId(param) {
  const id = Number(param);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('El parametro :id debe ser un entero positivo.');
    error.statusCode = 400;
    throw error;
  }

  return id;
}

async function createReview(req, res, next) {
  try {
    const created = await googleReviewsService.createReview(req.body);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
}

async function getReviewById(req, res, next) {
  try {
    const reviewId = parseReviewId(req.params.id);
    const review = await googleReviewsService.getReviewById(reviewId);
    res.json({ ok: true, data: review });
  } catch (error) {
    next(error);
  }
}

async function searchReviews(req, res, next) {
  try {
    const response = await googleReviewsService.searchReviews(req.query);
    res.json({ ok: true, ...response });
  } catch (error) {
    next(error);
  }
}

async function listPublicVisibleReviews(req, res, next) {
  try {
    const data = await googleReviewsService.listPublicVisibleReviews();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function updateReview(req, res, next) {
  try {
    const reviewId = parseReviewId(req.params.id);
    const updated = await googleReviewsService.updateReview(reviewId, req.body);
    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function updateReviewVisibility(req, res, next) {
  try {
    const reviewId = parseReviewId(req.params.id);
    const updated = await googleReviewsService.updateReviewVisibility(reviewId, req.body);
    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    const reviewId = parseReviewId(req.params.id);
    await googleReviewsService.deleteReview(reviewId);
    res.json({ ok: true, message: 'Resena eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReview,
  getReviewById,
  searchReviews,
  listPublicVisibleReviews,
  updateReview,
  updateReviewVisibility,
  deleteReview,
};