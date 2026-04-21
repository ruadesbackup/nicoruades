import { useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '../../../shared/services/apiClient'
import { listHomeCarousel, listPublicReviews } from '../services/homeService'

function buildAssetUrl(pathname) {
  if (!pathname) {
    return ''
  }

  if (/^https?:\/\//i.test(pathname)) {
    return pathname
  }

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')
  const origin = apiBase.replace(/\/api$/, '')
  return `${origin}${pathname.startsWith('/') ? '' : '/'}${pathname}`
}

export function useHomeData() {
  const [carousel, setCarousel] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchHomeData() {
      setLoading(true)
      setError('')

      try {
        const [carouselResponse, reviewsResponse] = await Promise.all([
          listHomeCarousel(),
          listPublicReviews(),
        ])

        if (!active) {
          return
        }

        setCarousel(carouselResponse?.data || [])
        setReviews(reviewsResponse?.data || [])
      } catch (requestError) {
        if (active) {
          setError(getApiErrorMessage(requestError))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void fetchHomeData()

    return () => {
      active = false
    }
  }, [])

  const carouselSlides = useMemo(() => {
    return carousel.map((item) => ({
      ...item,
      imgDesktopUrl: buildAssetUrl(item.img_desktop),
      imgMobileUrl: buildAssetUrl(item.img_mobile),
    }))
  }, [carousel])

  return {
    carouselSlides,
    reviews,
    loading,
    error,
  }
}
