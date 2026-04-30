require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('../src/config/db')

async function ensureAdmin(email, password, name = 'Admin') {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // insertar rol admin si no existe
    const roleRes = await client.query(`SELECT role_id FROM roles WHERE description = 'admin' LIMIT 1`)
    let roleId
    if (roleRes.rowCount === 0) {
      const ins = await client.query(`INSERT INTO roles (description) VALUES ('admin') RETURNING role_id`)
      roleId = ins.rows[0].role_id
    } else {
      roleId = roleRes.rows[0].role_id
    }

    // verificar usuario
    const userRes = await client.query('SELECT user_id FROM users WHERE email = $1 LIMIT 1', [email])
    if (userRes.rowCount > 0) {
      console.log('Usuario ya existe. No se crea nada.')
      await client.query('ROLLBACK')
      return
    }

    const hashed = await bcrypt.hash(password, 10)
    await client.query(
      `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)`,
      [name, email, hashed, roleId]
    )

    await client.query('COMMIT')
    console.log('Usuario admin creado')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
  } finally {
    client.release()
    process.exit()
  }
}

const [,, email, password] = process.argv
if (!email || !password) {
  console.log('Uso: node createAdmin.js email@example.com contraseña')
  process.exit(1)
}

ensureAdmin(email, password)
