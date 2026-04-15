'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchQuotes } from '@/lib/api/quotes'
import type { Quote } from '@/lib/types/library'

export function useQuotes(bookId?: string) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadQuotes = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchQuotes(bookId)
      setQuotes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes')
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    loadQuotes()
  }, [loadQuotes])

  return { quotes, loading, error, refetch: loadQuotes }
}
