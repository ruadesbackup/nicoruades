const carouselRepository = require('../repositories/carouselRepository');
const newsRepository = require('../repositories/newsRepository');
const cloudinary = require('../config/cloudinary');

function buildError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// 🔥 SUBIR A CLOUDINARY CON OPTIMIZACIONES
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: 'carousel',
        quality: 'auto',
        fetch_format: 'auto',
        responsive_width: true,
        width: 1280,
        crop: 'fill',
        gravity: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

// 🔧 HELPERS
function parseOrder(value, previousItem = null) {
  const fallback = previousItem ? previousItem.display_order : 0;

  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw buildError('display_order debe ser un entero >= 0.');
  }

  return parsed;
}

function parseNewsId(value, previousItem = null) {
  const fallback = previousItem ? previousItem.news_id : null;

  if (value === undefined) return fallback;

  if (value === null || value === '' || String(value).toLowerCase() === 'null') {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw buildError('news_id debe ser entero positivo o null.');
  }

  return parsed;
}

function parseBoolean(value, fieldName) {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true') return true;
    if (v === 'false') return false;
  }

  throw buildError(`${fieldName} debe ser booleano.`);
}

async function validateNewsReference(newsId) {
  if (!newsId) return;

  const found = await newsRepository.findNewsById(newsId);
  if (!found) {
    throw buildError('La noticia asociada no existe.', 404);
  }
}

// 🧠 NORMALIZACIÓN (SIN LOCAL FILES)
function normalizePayload(body, previousItem = null) {
  const removeDesktop =
    body.remove_img_desktop !== undefined
      ? parseBoolean(body.remove_img_desktop, 'remove_img_desktop')
      : false;

  const removeMobile =
    body.remove_img_mobile !== undefined
      ? parseBoolean(body.remove_img_mobile, 'remove_img_mobile')
      : false;

  const displayOrder = parseOrder(body.display_order, previousItem);
  const newsId = parseNewsId(body.news_id, previousItem);

  return {
    img_desktop: removeDesktop ? null : previousItem?.img_desktop || null,
    img_mobile: removeMobile ? null : previousItem?.img_mobile || null,
    display_order: displayOrder,
    news_id: newsId,
    removeDesktop,
    removeMobile,
  };
}

// 🚀 CREATE
async function createCarousel(body, files) {
  const payload = normalizePayload(body);

  if (files?.img_desktop) {
    const result = await uploadToCloudinary(files.img_desktop[0].buffer);
    payload.img_desktop = result.secure_url;
  }

  if (files?.img_mobile) {
    const result = await uploadToCloudinary(files.img_mobile[0].buffer);
    payload.img_mobile = result.secure_url;
  }

  if (!payload.img_desktop && !payload.img_mobile) {
    throw buildError('Debes subir al menos una imagen.');
  }

  await validateNewsReference(payload.news_id);

  return carouselRepository.createCarousel(payload);
}

// 🔍 GET
async function getCarouselById(carouselId) {
  const item = await carouselRepository.findCarouselById(carouselId);

  if (!item) {
    throw buildError('Item no encontrado.', 404);
  }

  return item;
}

async function listCarousel() {
  return carouselRepository.listCarousel();
}

// ✏️ UPDATE
async function updateCarousel(carouselId, body, files) {
  const existing = await carouselRepository.findCarouselById(carouselId);

  if (!existing) {
    throw buildError('Item no encontrado.', 404);
  }

  const payload = normalizePayload(body, existing);

  if (files?.img_desktop) {
    const result = await uploadToCloudinary(files.img_desktop[0].buffer);
    payload.img_desktop = result.secure_url;
  }

  if (files?.img_mobile) {
    const result = await uploadToCloudinary(files.img_mobile[0].buffer);
    payload.img_mobile = result.secure_url;
  }

  await validateNewsReference(payload.news_id);

  return carouselRepository.updateCarousel(carouselId, payload);
}

// 🗑 DELETE
async function deleteCarousel(carouselId) {
  const removed = await carouselRepository.deleteCarousel(carouselId);

  if (!removed) {
    throw buildError('Item no encontrado.', 404);
  }

  return removed;
}

module.exports = {
  createCarousel,
  getCarouselById,
  listCarousel,
  updateCarousel,
  deleteCarousel,
};