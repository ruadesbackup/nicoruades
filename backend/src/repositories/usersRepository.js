const pool = require('../config/db');

async function findByEmail(email) {
  const result = await pool.query(
    `
      SELECT u.user_id, u.name, u.email, u.password, r.role_id, r.description AS role
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = $1
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
}

async function findById(userId) {
  const result = await pool.query(
    `
      SELECT u.user_id, u.name, u.email, r.role_id, r.description AS role
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = $1
      LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

module.exports = {
  findByEmail,
  findById,
};
