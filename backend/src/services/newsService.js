const newsRepository = require('../repositories/newsRepository');
const cloudinary = require('../config/cloudinary');

function buildError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateUrl(value, fieldName) {
  if (!value) return null;

  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error();
    }
    return value;
  } catch {
    throw buildError(`${fieldName} debe ser una URL valida (http/https).`);
  }
}

function validateYoutubeUrl(value) {
  if (!value) return null;

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
    counter++;
  }

  throw buildError('No se pudo generar un slug unico.', 500);
}

// 🔥 SUBIDA A CLOUDINARY
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'noticias' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

// 🔹 NORMALIZACIÓN (sin paths locales)
function normalizePayload(body, previousNews = null) {
  const title = body.title ? String(body.title).trim() : previousNews?.title;

  const content =
    body.content !== undefined
      ? String(body.content).trim()
      : previousNews?.content || null;

  if (!title) {
    throw buildError('title es obligatorio.');
  }

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
    youtube_url: youtubeUrl,
    external_url: externalUrl,
    img_desktop: previousNews?.img_desktop || null,
    img_mobile: previousNews?.img_mobile || null,
    titleChanged: previousNews ? title !== previousNews.title : true,
  };
}

// 🚀 CREATE
async function createNews(body, files) {
  const payload = normalizePayload(body);

  if (files?.img_desktop) {
    const result = await uploadToCloudinary(files.img_desktop[0].buffer);
    payload.img_desktop = result.secure_url;
  }

  if (files?.img_mobile) {
    const result = await uploadToCloudinary(files.img_mobile[0].buffer);
    payload.img_mobile = result.secure_url;
  }

  payload.slug = await buildUniqueSlug(payload.title);

  return newsRepository.createNews(payload);
}

// 🔍 GET
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

// 🔎 SEARCH
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

// ✏️ UPDATE
async function updateNews(newsId, body, files) {
  const existingNews = await newsRepository.findNewsById(newsId);

  if (!existingNews) {
    throw buildError('Noticia no encontrada.', 404);
  }

  const payload = normalizePayload(body, existingNews);

  if (files?.img_desktop) {
    const result = await uploadToCloudinary(files.img_desktop[0].buffer);
    payload.img_desktop = result.secure_url;
  }

  if (files?.img_mobile) {
    const result = await uploadToCloudinary(files.img_mobile[0].buffer);
    payload.img_mobile = result.secure_url;
  }

  payload.slug = payload.titleChanged
    ? await buildUniqueSlug(payload.title, newsId)
    : existingNews.slug;

  return newsRepository.updateNews(newsId, payload);
}

// 🗑 DELETE
async function deleteNews(newsId) {
  const removed = await newsRepository.deleteNews(newsId);

  if (!removed) {
    throw buildError('Noticia no encontrada.', 404);
  }

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