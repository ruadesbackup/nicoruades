const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/environment');
const usersRepository = require('../repositories/usersRepository');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET || 'change_me');
    } catch (err) {
      return res.status(401).json({ ok: false, message: 'Token inválido' });
    }

    // opcional: refrescar info del usuario desde DB
    const user = await usersRepository.findById(payload.user_id);
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
    }

    req.user = { user_id: user.user_id, name: user.name, email: user.email, role: user.role };

    // Requerir rol admin para acceso a rutas protegidas
    if (req.method !== 'GET' && req.user.role !== 'admin') {
      return res.status(403).json({ ok: false, message: 'Acceso denegado' });
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAuth;
