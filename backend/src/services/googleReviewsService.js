const googleReviewsRepository = require('../repositories/googleReviewsRepository');

function buildError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseBoolean(value, fieldName) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  throw buildError(`${fieldName} debe ser un booleano.`);
}

function parseRating(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    throw buildError('rating debe ser un entero entre 1 y 5.');
  }

  return parsed;
}

function validateUrl(value, fieldName) {
  const safeValue = String(value || '').trim();

  if (!safeValue) {
    throw buildError(`${fieldName} es obligatorio.`);
  }

  try {
    const parsed = new URL(safeValue);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('invalid-protocol');
    }
    return safeValue;
  } catch (_error) {
    throw buildError(`${fieldName} debe ser una URL valida (http/https).`);
  }
}

function validateOptionalUrl(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }

  return validateUrl(value, fieldName);
}

function parseReviewDate(value) {
  const safeValue = String(value || '').trim();

  if (!safeValue) {
    throw buildError('review_date es obligatorio.');
  }

  const date = new Date(safeValue);
  if (Number.isNaN(date.getTime())) {
    throw buildError('review_date debe tener un formato de fecha valido (ISO recomendado).');
  }

  return date.toISOString();
}

function normalizeCreatePayload(body) {
  const authorName = String(body.author_name || '').trim();

  if (!authorName) {
    throw buildError('author_name es obligatorio.');
  }

  return {
    author_name: authorName,
    content: body.content !== undefined ? String(body.content).trim() : null,
    rating: parseRating(body.rating),
    review_url: validateUrl(body.review_url, 'review_url'),
    profile_photo_url: validateOptionalUrl(body.profile_photo_url, 'profile_photo_url'),
    review_date: parseReviewDate(body.review_date),
    is_visible:
      body.is_visible !== undefined ? parseBoolean(body.is_visible, 'is_visible') : true,
  };
}

function normalizeUpdatePayload(body, existingReview) {
  const authorName =
    body.author_name !== undefined
      ? String(body.author_name).trim()
      : existingReview.author_name;

  if (!authorName) {
    throw buildError('author_name es obligatorio.');
  }

  const rating =
    body.rating !== undefined ? parseRating(body.rating) : parseRating(existingReview.rating);

  const reviewUrl =
    body.review_url !== undefined
      ? validateUrl(body.review_url, 'review_url')
      : validateUrl(existingReview.review_url, 'review_url');

  const profilePhotoUrl =
    body.profile_photo_url !== undefined
      ? validateOptionalUrl(body.profile_photo_url, 'profile_photo_url')
      : existingReview.profile_photo_url;

  const reviewDate =
    body.review_date !== undefined
      ? parseReviewDate(body.review_date)
      : parseReviewDate(existingReview.review_date);

  const isVisible =
    body.is_visible !== undefined
      ? parseBoolean(body.is_visible, 'is_visible')
      : existingReview.is_visible;

  return {
    author_name: authorName,
    content: body.content !== undefined ? String(body.content).trim() : existingReview.content,
    rating,
    review_url: reviewUrl,
    profile_photo_url: profilePhotoUrl,
    review_date: reviewDate,
    is_visible: isVisible,
  };
}

async function createReview(body) {
  const payload = normalizeCreatePayload(body);
  return googleReviewsRepository.createReview(payload);
}

async function getReviewById(reviewId) {
  const review = await googleReviewsRepository.findReviewById(reviewId);

  if (!review) {
    throw buildError('Resena no encontrada.', 404);
  }

  return review;
}

async function searchReviews(query) {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const authorName = query.author_name ? String(query.author_name).trim() : null;

  let rating = null;
  if (query.rating !== undefined && query.rating !== null && query.rating !== '') {
    rating = parseRating(query.rating);
  }

  const result = await googleReviewsRepository.searchReviews({
    authorName,
    rating,
    page,
    limit,
  });

  return {
    page,
    limit,
    total: result.total,
    totalPages: Math.max(1, Math.ceil(result.total / limit)),
    data: result.data,
  };
}

async function listPublicVisibleReviews() {
  return googleReviewsRepository.listPublicVisibleReviews();
}

async function updateReview(reviewId, body) {
  const existingReview = await googleReviewsRepository.findReviewById(reviewId);

  if (!existingReview) {
    throw buildError('Resena no encontrada.', 404);
  }

  const payload = normalizeUpdatePayload(body, existingReview);
  return googleReviewsRepository.updateReview(reviewId, payload);
}

async function updateReviewVisibility(reviewId, body) {
  if (body.is_visible === undefined) {
    throw buildError('is_visible es obligatorio.');
  }

  const isVisible = parseBoolean(body.is_visible, 'is_visible');
  const updated = await googleReviewsRepository.updateReviewVisibility(reviewId, isVisible);

  if (!updated) {
    throw buildError('Resena no encontrada.', 404);
  }

  return updated;
}

async function deleteReview(reviewId) {
  const removed = await googleReviewsRepository.deleteReview(reviewId);

  if (!removed) {
    throw buildError('Resena no encontrada.', 404);
  }

  return removed;
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