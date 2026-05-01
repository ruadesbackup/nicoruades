const multer = require('multer');

const uploadNewsMedia = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Formato de imagen no permitido.'));
    }

    cb(null, true);
  },
}).fields([
  { name: 'img_desktop', maxCount: 1 },
  { name: 'img_mobile', maxCount: 1 },
]);

module.exports = uploadNewsMedia;