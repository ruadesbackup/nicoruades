const fs = require('fs');
const path = require('path');
const newsRepository = require('../repositories/newsRepository');

function buildError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateUrl(value, fieldName) {
  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('invalid-protocol');
    }
    return value;
  } catch (_error) {
    throw buildError(`${fieldName} debe ser una URL valida (http/https).`);
  }
}

function validateYoutubeUrl(value) {
  if (!value) {
    return null;
  }

  validateUrl(value, 'youtube_url');

  const isYoutube =
    value.includes('youtube.com') || value.includes('youtu.be');

  if (!isYoutube) {
    throw buildError('youtube_url debe pertenecer a YouTube.');
  }

  return value;
}

function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 180);
}

async function buildUniqueSlug(title, excludeNewsId = null) {
  const baseSlug = slugify(title) || 'noticia';

  if (!(await newsRepository.existsSlug(baseSlug, excludeNewsId))) {
    return baseSlug;
  }

  let counter = 2;
  while (counter <= 9999) {
    const candidate = `${baseSlug}-${counter}`;
    if (!(await newsRepository.existsSlug(candidate, excludeNewsId))) {
      return candidate;
    }
    counter += 1;
  }

  throw buildError('No se pudo generar un slug unico para la noticia.', 500);
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

function normalizePayload(body, files, previousNews = null) {
  const title = body.title ? String(body.title).trim() : previousNews?.title;
  const content =
    body.content !== undefined ? String(body.content).trim() : previousNews?.content || null;

  if (!title) {
    throw buildError('title es obligatorio.');
  }

  const incomingDesktop = files?.img_desktop?.[0]?.path;
  const incomingMobile = files?.img_mobile?.[0]?.path;

  const imgDesktop = incomingDesktop
    ? filePathToPublicUrl(incomingDesktop)
    : previousNews?.img_desktop || null;

  const imgMobile = incomingMobile
    ? filePathToPublicUrl(incomingMobile)
    : previousNews?.img_mobile || null;

  const youtubeUrl =
    body.youtube_url !== undefined
      ? validateYoutubeUrl(String(body.youtube_url).trim())
      : previousNews?.youtube_url || null;

  const externalUrl =
    body.external_url !== undefined
      ? validateUrl(String(body.external_url).trim(), 'external_url')
      : previousNews?.external_url || null;

  return {
    title,
    content,
    img_desktop: imgDesktop,
    img_mobile: imgMobile,
    youtube_url: youtubeUrl,
    external_url: externalUrl,
    titleChanged: previousNews ? title !== previousNews.title : true,
    incomingDesktop: Boolean(incomingDesktop),
    incomingMobile: Boolean(incomingMobile),
  };
}

async function createNews(body, files) {
  const payload = normalizePayload(body, files);
  payload.slug = await buildUniqueSlug(payload.title);
  return newsRepository.createNews(payload);
}

async function getNewsById(newsId) {
  const news = await newsRepository.findNewsById(newsId);

  if (!news) {
    throw buildError('Noticia no encontrada.', 404);
  }

  return news;
}

async function getNewsBySlug(slug) {
  const safeSlug = String(slug || '').trim();

  if (!safeSlug) {
    throw buildError('El parametro :slug es obligatorio.', 400);
  }

  const news = await newsRepository.findNewsBySlug(safeSlug);

  if (!news) {
    throw buildError('Noticia no encontrada.', 404);
  }

  return news;
}

async function searchNews(query) {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const search = query.search ? String(query.search).trim() : null;

  const result = await newsRepository.searchNews({
    search,
    page,
    limit,
  });

  return {
    page,
    limit,
    total: result.total,
    totalPages: Math.max(1, Math.ceil(result.total / limit)),
    data: result.data,
  };
}

async function updateNews(newsId, body, files) {
  const existingNews = await newsRepository.findNewsById(newsId);

  if (!existingNews) {
    throw buildError('Noticia no encontrada.', 404);
  }

  const payload = normalizePayload(body, files, existingNews);
  payload.slug = payload.titleChanged
    ? await buildUniqueSlug(payload.title, newsId)
    : existingNews.slug;

  if (payload.incomingDesktop) {
    deleteLocalFile(existingNews.img_desktop);
  }

  if (payload.incomingMobile) {
    deleteLocalFile(existingNews.img_mobile);
  }

  return newsRepository.updateNews(newsId, payload);
}

async function deleteNews(newsId) {
  const removed = await newsRepository.deleteNews(newsId);

  if (!removed) {
    throw buildError('Noticia no encontrada.', 404);
  }

  deleteLocalFile(removed.img_desktop);
  deleteLocalFile(removed.img_mobile);

  return removed;
}

module.exports = {
  createNews,
  getNewsById,
  getNewsBySlug,
  searchNews,
  updateNews,
  deleteNews,
};
