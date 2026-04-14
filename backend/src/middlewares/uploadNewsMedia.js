const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'banners');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 40);

    cb(null, `${Date.now()}-${safeBaseName}${extension.toLowerCase()}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error('Formato de imagen no permitido. Usa JPG, PNG o WEBP.'));
  }

  cb(null, true);
};

const uploadNewsMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: 'img_desktop', maxCount: 1 },
  { name: 'img_mobile', maxCount: 1 },
]);

module.exports = uploadNewsMedia;
