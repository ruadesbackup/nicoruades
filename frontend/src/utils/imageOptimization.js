/**
 * Genera URLs optimizadas de Cloudinary
 * @param {string} publicId - El ID público de Cloudinary
 * @param {Object} options - Opciones de transformación
 * @returns {string} URL optimizada
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  if (!publicId) return '';

  const baseUrl = 'https://res.cloudinary.com/dh6rfzzxo/image/fetch';
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    `g_${gravity}`,
  ].filter((t) => t !== 'w_auto' && t !== 'h_auto').join(',');

  return `${baseUrl}/f_auto,q_auto/${transformations}/${publicId}`;
};

/**
 * Genera srcSet para imágenes responsive
 * @param {string} publicId - El ID público de Cloudinary
 * @returns {string} srcSet string
 */
export const getResponsiveImageSrcSet = (publicId) => {
  if (!publicId) return '';

  const widths = [320, 640, 960, 1280, 1920];
  return widths
    .map((w) => `${getCloudinaryUrl(publicId, { width: w })} ${w}w`)
    .join(', ');
};

/**
 * Genera objeto para componentes de imagen con optimizaciones
 * @param {string} publicId - El ID público de Cloudinary
 * @param {string} alt - Texto alternativo
 * @returns {Object} Props optimizados
 */
export const getOptimizedImageProps = (publicId, alt = '') => ({
  src: getCloudinaryUrl(publicId, { width: 1280 }),
  srcSet: getResponsiveImageSrcSet(publicId),
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1280px',
  alt,
  loading: 'lazy',
  decoding: 'async',
});
