const { Pool } = require('pg');

// Determinar si usa DATABASE_URL (Supabase/Producción) o credenciales locales
const connectionConfig =
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'nicoruades',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
      };

// Opciones adicionales para SSL en producción
if (process.env.NODE_ENV === 'production') {
  connectionConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(connectionConfig);

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

// Verificar conexión al iniciar
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('✓ Conexión a PostgreSQL exitosa:', result.rows[0].now);
  }
});

module.exports = pool;
