const carouselService = require('../services/carouselService');

function parseCarouselId(param) {
  const id = Number(param);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('El parametro :id debe ser un entero positivo.');
    error.statusCode = 400;
    throw error;
  }

  return id;
}

async function createCarousel(req, res, next) {
  try {
    const created = await carouselService.createCarousel(req.body, req.files);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
}

async function getCarouselById(req, res, next) {
  try {
    const carouselId = parseCarouselId(req.params.id);
    const item = await carouselService.getCarouselById(carouselId);
    res.json({ ok: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function listCarousel(req, res, next) {
  try {
    const data = await carouselService.listCarousel();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function updateCarousel(req, res, next) {
  try {
    const carouselId = parseCarouselId(req.params.id);
    const updated = await carouselService.updateCarousel(carouselId, req.body, req.files);
    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteCarousel(req, res, next) {
  try {
    const carouselId = parseCarouselId(req.params.id);
    await carouselService.deleteCarousel(carouselId);
    res.json({ ok: true, message: 'Item de carousel eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCarousel,
  getCarouselById,
  listCarousel,
  updateCarousel,
  deleteCarousel,
};
