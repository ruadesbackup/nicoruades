const fs = require('fs');
const path = require('path');
const carouselRepository = require('../repositories/carouselRepository');
const newsRepository = require('../repositories/newsRepository');

function buildError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function filePathToPublicUrl(filePath) {
  if (!filePath) {
    return null;
  }

  const fileName = path.basename(filePath);
  return `/uploads/banners/${fileName}`;
}

function deleteLocalFile(publicUrl) {
  if (!publicUrl) {
    return;
  }

  const fileName = path.basename(publicUrl);
  const absolutePath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'uploads',
    'banners',
    fileName
  );

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

function parseOrder(value, previousItem = null) {
  const fallback = previousItem ? previousItem.display_order : 0;
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw buildError('display_order debe ser un entero mayor o igual a 0.');
  }

  return parsed;
}

function parseNewsId(value, previousItem = null) {
  const fallback = previousItem ? previousItem.news_id : null;
  if (value === undefined) {
    return fallback;
  }

  if (value === null || value === '' || String(value).toLowerCase() === 'null') {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw buildError('news_id debe ser un entero positivo o null.');
  }

  return parsed;
}

function parseBoolean(value, fieldName) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  throw buildError(`${fieldName} debe ser un booleano.`);
}

async function validateNewsReference(newsId) {
  if (!newsId) {
    return;
  }

  const foundNews = await newsRepository.findNewsById(newsId);
  if (!foundNews) {
    throw buildError('La noticia asociada (news_id) no existe.', 404);
  }
}

function normalizePayload(body, files, previousItem = null) {
  const incomingDesktop = files?.img_desktop?.[0]?.path;
  const incomingMobile = files?.img_mobile?.[0]?.path;

  const removeDesktop =
    !incomingDesktop && body.remove_img_desktop !== undefined
      ? parseBoolean(body.remove_img_desktop, 'remove_img_desktop')
      : false;

  const removeMobile =
    !incomingMobile && body.remove_img_mobile !== undefined
      ? parseBoolean(body.remove_img_mobile, 'remove_img_mobile')
      : false;

  const imgDesktop = removeDesktop
    ? null
    : incomingDesktop
      ? filePathToPublicUrl(incomingDesktop)
      : previousItem?.img_desktop || null;

  const imgMobile = removeMobile
    ? null
    : incomingMobile
      ? filePathToPublicUrl(incomingMobile)
      : previousItem?.img_mobile || null;

  const displayOrder = parseOrder(body.display_order, previousItem);
  const newsId = parseNewsId(body.news_id, previousItem);

  if (!imgDesktop && !imgMobile) {
    throw buildError('Debes subir al menos una imagen (img_desktop o img_mobile).');
  }

  return {
    img_desktop: imgDesktop,
    img_mobile: imgMobile,
    display_order: displayOrder,
    news_id: newsId,
    incomingDesktop: Boolean(incomingDesktop),
    incomingMobile: Boolean(incomingMobile),
    removeDesktop,
    removeMobile,
  };
}

async function createCarousel(body, files) {
  const payload = normalizePayload(body, files);
  await validateNewsReference(payload.news_id);
  return carouselRepository.createCarousel(payload);
}

async function getCarouselById(carouselId) {
  const item = await carouselRepository.findCarouselById(carouselId);

  if (!item) {
    throw buildError('Item de carousel no encontrado.', 404);
  }

  return item;
}

async function listCarousel() {
  return carouselRepository.listCarousel();
}

async function updateCarousel(carouselId, body, files) {
  const existingItem = await carouselRepository.findCarouselById(carouselId);

  if (!existingItem) {
    throw buildError('Item de carousel no encontrado.', 404);
  }

  const payload = normalizePayload(body, files, existingItem);
  await validateNewsReference(payload.news_id);

  if (payload.incomingDesktop) {
    deleteLocalFile(existingItem.img_desktop);
  }

  if (payload.removeDesktop) {
    deleteLocalFile(existingItem.img_desktop);
  }

  if (payload.incomingMobile) {
    deleteLocalFile(existingItem.img_mobile);
  }

  if (payload.removeMobile) {
    deleteLocalFile(existingItem.img_mobile);
  }

  return carouselRepository.updateCarousel(carouselId, payload);
}

async function deleteCarousel(carouselId) {
  const removed = await carouselRepository.deleteCarousel(carouselId);

  if (!removed) {
    throw buildError('Item de carousel no encontrado.', 404);
  }

  deleteLocalFile(removed.img_desktop);
  deleteLocalFile(removed.img_mobile);

  return removed;
}

module.exports = {
  createCarousel,
  getCarouselById,
  listCarousel,
  updateCarousel,
  deleteCarousel,
};
