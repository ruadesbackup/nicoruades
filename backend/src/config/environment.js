// Validar variables de entorno requeridas
const requiredEnv = ['DB_NAME'];

requiredEnv.forEach((variable) => {
  if (!process.env[variable] && !process.env.DATABASE_URL) {
    throw new Error(
      `Falta variable de entorno: ${variable} o DATABASE_URL`
    );
  }
});

module.exports = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'nicoruades',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 3000,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
