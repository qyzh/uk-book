'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchBooks } from '@/lib/api/books'
import type { Book } from '@/lib/types/library'

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBooks = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchBooks()
      setBooks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBooks()
  }, [loadBooks])

  return { books, loading, error, refetch: loadBooks }
}
