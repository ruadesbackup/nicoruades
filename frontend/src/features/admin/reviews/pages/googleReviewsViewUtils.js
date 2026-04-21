export function handleRatingStars(value) {
  const rating = Number(value) || 0
  return '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating)
}

export function formatReviewDate(value) {
  if (!value) {
    return 'Sin fecha'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Fecha inválida'
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatShortDate(value) {
  if (!value) {
    return 'Sin auditoría'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Fecha inválida'
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
  }).format(date)
}