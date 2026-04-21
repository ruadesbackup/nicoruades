const pool = require('../config/db');

async function createReview(payload) {
  const result = await pool.query(
    `
      INSERT INTO google_reviews (
        author_name,
        content,
        rating,
        review_url,
        profile_photo_url,
        review_date,
        is_visible
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        review_id,
        google_review_id,
        author_name,
        content,
        rating,
        review_url,
        profile_photo_url,
        is_visible,
        review_date,
        created_at
    `,
    [
      payload.author_name,
      payload.content,
      payload.rating,
      payload.review_url,
      payload.profile_photo_url,
      payload.review_date,
      payload.is_visible,
    ]
  );

  return result.rows[0];
}

async function findReviewById(reviewId) {
  const result = await pool.query(
    `
      SELECT
        review_id,
        google_review_id,
        author_name,
        content,
        rating,
        review_url,
        profile_photo_url,
        is_visible,
        review_date,
        created_at
      FROM google_reviews
      WHERE review_id = $1
    `,
    [reviewId]
  );

  return result.rows[0] || null;
}

async function searchReviews({ authorName, rating, page, limit }) {
  const offset = (page - 1) * limit;
  const authorTerm = authorName ? `%${authorName}%` : null;

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::INTEGER AS total
      FROM google_reviews
      WHERE ($1::TEXT IS NULL OR author_name ILIKE $1)
      AND ($2::INTEGER IS NULL OR rating = $2)
    `,
    [authorTerm, rating]
  );

  const listResult = await pool.query(
    `
      SELECT
        review_id,
        google_review_id,
        author_name,
        content,
        rating,
        review_url,
        profile_photo_url,
        is_visible,
        review_date,
        created_at
      FROM google_reviews
      WHERE ($1::TEXT IS NULL OR author_name ILIKE $1)
      AND ($2::INTEGER IS NULL OR rating = $2)
      ORDER BY review_date DESC NULLS LAST, review_id DESC
      LIMIT $3 OFFSET $4
    `,
    [authorTerm, rating, limit, offset]
  );

  return {
    total: countResult.rows[0].total,
    data: listResult.rows,
  };
}

async function listPublicVisibleReviews() {
  const result = await pool.query(
    `
      SELECT
        review_id,
        author_name,
        content,
        rating,
        review_url,
        profile_photo_url,
        review_date
      FROM google_reviews
      WHERE is_visible = TRUE
      ORDER BY review_date DESC NULLS LAST, review_id DESC
    `
  );

  return result.rows;
}

async function updateReview(reviewId, payload) {
  const result = await pool.query(
    `
      UPDATE google_reviews
      SET
        author_name = $2,
        content = $3,
        rating = $4,
        review_url = $5,
        profile_photo_url = $6,
        review_date = $7,
        is_visible = $8
      WHERE review_id = $1
      RETURNING
        review_id,
        google_review_id,
        author_name,
        content,
        rating,
        review_url,
        profile_photo_url,
        is_visible,
        review_date,
        created_at
    `,
    [
      reviewId,
      payload.author_name,
      payload.content,
      payload.rating,
      payload.review_url,
      payload.profile_photo_url,
      payload.review_date,
      payload.is_visible,
    ]
  );

  return result.rows[0] || null;
}

async function updateReviewVisibility(reviewId, isVisible) {
  const result = await pool.query(
    `
      UPDATE google_reviews
      SET is_visible = $2
      WHERE review_id = $1
      RETURNING
        review_id,
        google_review_id,
        author_name,
        content,
        rating,
        review_url,
        profile_photo_url,
        is_visible,
        review_date,
        created_at
    `,
    [reviewId, isVisible]
  );

  return result.rows[0] || null;
}

async function deleteReview(reviewId) {
  const result = await pool.query(
    `
      DELETE FROM google_reviews
      WHERE review_id = $1
      RETURNING review_id
    `,
    [reviewId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createReview,
  findReviewById,
  searchReviews,
  listPublicVisibleReviews,
  updateReview,
  updateReviewVisibility,
  deleteReview,
};