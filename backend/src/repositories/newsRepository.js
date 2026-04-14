const pool = require('../config/db');

async function createNews(payload) {
  const query = `
    INSERT INTO news (title, content, img_desktop, img_mobile, youtube_url, external_url, slug)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING news_id, title, content, img_desktop, img_mobile, youtube_url, external_url, slug, created_at
  `;

  const values = [
    payload.title,
    payload.content,
    payload.img_desktop,
    payload.img_mobile,
    payload.youtube_url,
    payload.external_url,
    payload.slug,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function findNewsById(newsId) {
  const result = await pool.query(
    `
      SELECT news_id, title, content, img_desktop, img_mobile, youtube_url, external_url, slug, created_at
      FROM news
      WHERE news_id = $1
    `,
    [newsId]
  );

  return result.rows[0] || null;
}

async function findNewsBySlug(slug) {
  const result = await pool.query(
    `
      SELECT news_id, title, content, img_desktop, img_mobile, youtube_url, external_url, slug, created_at
      FROM news
      WHERE slug = $1
    `,
    [slug]
  );

  return result.rows[0] || null;
}

async function existsSlug(slug, excludeNewsId = null) {
  const result = await pool.query(
    `
      SELECT 1
      FROM news
      WHERE slug = $1
      AND ($2::INTEGER IS NULL OR news_id <> $2)
      LIMIT 1
    `,
    [slug, excludeNewsId]
  );

  return result.rowCount > 0;
}

async function searchNews({ search, page, limit }) {
  const offset = (page - 1) * limit;
  const searchTerm = search ? `%${search}%` : null;

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::INTEGER AS total
      FROM news
      WHERE ($1::TEXT IS NULL OR title ILIKE $1 OR content ILIKE $1)
    `,
    [searchTerm]
  );

  const listResult = await pool.query(
    `
      SELECT news_id, title, content, img_desktop, img_mobile, youtube_url, external_url, slug, created_at
      FROM news
      WHERE ($1::TEXT IS NULL OR title ILIKE $1 OR content ILIKE $1 OR slug ILIKE $1)
      ORDER BY created_at DESC, news_id DESC
      LIMIT $2 OFFSET $3
    `,
    [searchTerm, limit, offset]
  );

  return {
    total: countResult.rows[0].total,
    data: listResult.rows,
  };
}

async function updateNews(newsId, payload) {
  const query = `
    UPDATE news
    SET
      title = $2,
      content = $3,
      img_desktop = $4,
      img_mobile = $5,
      youtube_url = $6,
      external_url = $7,
      slug = $8
    WHERE news_id = $1
    RETURNING news_id, title, content, img_desktop, img_mobile, youtube_url, external_url, slug, created_at
  `;

  const values = [
    newsId,
    payload.title,
    payload.content,
    payload.img_desktop,
    payload.img_mobile,
    payload.youtube_url,
    payload.external_url,
    payload.slug,
  ];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteNews(newsId) {
  const result = await pool.query(
    `
      DELETE FROM news
      WHERE news_id = $1
      RETURNING news_id, img_desktop, img_mobile
    `,
    [newsId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createNews,
  findNewsById,
  findNewsBySlug,
  existsSlug,
  searchNews,
  updateNews,
  deleteNews,
};
