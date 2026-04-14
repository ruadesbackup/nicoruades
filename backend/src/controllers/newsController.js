const newsService = require('../services/newsService');

function parseNewsId(param) {
  const id = Number(param);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('El parametro :id debe ser un entero positivo.');
    error.statusCode = 400;
    throw error;
  }

  return id;
}

async function createNews(req, res, next) {
  try {
    const created = await newsService.createNews(req.body, req.files);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    next(error);
  }
}

async function getNewsById(req, res, next) {
  try {
    const newsId = parseNewsId(req.params.id);
    const news = await newsService.getNewsById(newsId);
    res.json({ ok: true, data: news });
  } catch (error) {
    next(error);
  }
}

async function getNewsBySlug(req, res, next) {
  try {
    const news = await newsService.getNewsBySlug(req.params.slug);
    res.json({ ok: true, data: news });
  } catch (error) {
    next(error);
  }
}

async function searchNews(req, res, next) {
  try {
    const response = await newsService.searchNews(req.query);
    res.json({ ok: true, ...response });
  } catch (error) {
    next(error);
  }
}

async function updateNews(req, res, next) {
  try {
    const newsId = parseNewsId(req.params.id);
    const updated = await newsService.updateNews(newsId, req.body, req.files);
    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteNews(req, res, next) {
  try {
    const newsId = parseNewsId(req.params.id);
    await newsService.deleteNews(newsId);
    res.json({ ok: true, message: 'Noticia eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createNews,
  getNewsById,
  getNewsBySlug,
  searchNews,
  updateNews,
  deleteNews,
};
