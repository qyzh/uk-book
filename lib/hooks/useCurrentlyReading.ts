'use client'

import { useMemo } from 'react'
import { useBooks } from '@/lib/hooks/useBooks'

export function useCurrentlyReading() {
  const { books, loading, error, refetch } = useBooks()

  const currentBook = useMemo(
    () => books.find((book) => book.reading_status === 'reading') || null,
    [books],
  )

  return { currentBook, loading, error, refetch }
}
