'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuotes } from '@/lib/hooks/useQuotes'

export function useQuoteCarousel(intervalMs = 6000) {
  const { quotes, loading, error } = useQuotes()
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  const favoriteQuotes = useMemo(() => {
    const favorites = quotes.filter((quote) => quote.is_favorite)
    // Sort by id for deterministic order
    return favorites.sort((a, b) => a.id.localeCompare(b.id)).slice(0, 5)
  }, [quotes])

  useEffect(() => {
    if (favoriteQuotes.length === 0) return

    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % favoriteQuotes.length)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [favoriteQuotes.length, intervalMs])

  return {
    quotes,
    favoriteQuotes,
    loading,
    error,
    currentQuoteIndex,
    setCurrentQuoteIndex,
  }
}