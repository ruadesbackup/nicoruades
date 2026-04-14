function errorHandler(err, _req, res, _next) {
  if (res.headersSent) {
    return;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    ok: false,
    message: err.message || 'Error interno del servidor',
  });
}

module.exports = errorHandler;
