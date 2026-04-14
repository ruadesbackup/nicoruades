const pool = require('../config/db');

async function createCarousel(payload) {
  const result = await pool.query(
    `
      INSERT INTO carousel_home (img_desktop, img_mobile, display_order, news_id)
      VALUES ($1, $2, $3, $4)
      RETURNING carousel_id, img_desktop, img_mobile, display_order, news_id
    `,
    [payload.img_desktop, payload.img_mobile, payload.display_order, payload.news_id]
  );

  return result.rows[0];
}

async function findCarouselById(carouselId) {
  const result = await pool.query(
    `
      SELECT carousel_id, img_desktop, img_mobile, display_order, news_id
      FROM carousel_home
      WHERE carousel_id = $1
    `,
    [carouselId]
  );

  return result.rows[0] || null;
}

async function listCarousel() {
  const result = await pool.query(
    `
      SELECT carousel_id, img_desktop, img_mobile, display_order, news_id
      FROM carousel_home
      ORDER BY display_order ASC, carousel_id ASC
    `
  );

  return result.rows;
}

async function updateCarousel(carouselId, payload) {
  const result = await pool.query(
    `
      UPDATE carousel_home
      SET
        img_desktop = $2,
        img_mobile = $3,
        display_order = $4,
        news_id = $5
      WHERE carousel_id = $1
      RETURNING carousel_id, img_desktop, img_mobile, display_order, news_id
    `,
    [carouselId, payload.img_desktop, payload.img_mobile, payload.display_order, payload.news_id]
  );

  return result.rows[0] || null;
}

async function deleteCarousel(carouselId) {
  const result = await pool.query(
    `
      DELETE FROM carousel_home
      WHERE carousel_id = $1
      RETURNING carousel_id, img_desktop, img_mobile, display_order, news_id
    `,
    [carouselId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createCarousel,
  findCarouselById,
  listCarousel,
  updateCarousel,
  deleteCarousel,
};
