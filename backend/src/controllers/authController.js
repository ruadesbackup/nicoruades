const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRepository = require('../repositories/usersRepository');
const { JWT_SECRET } = require('../config/environment');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email y contraseña requeridos' });
    }

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const payload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET || 'change_me', { expiresIn: '5m' });

    return res.json({ ok: true, token, user: payload });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
};
