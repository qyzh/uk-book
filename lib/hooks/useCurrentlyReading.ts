'use client'

import { useMemo } from 'react'
import { useBooks } from '@/lib/hooks/useBooks'

export function useCurrentlyReading() {
  const { books, loading, error, refetch } = useBooks()

  const currentBooks = useMemo(
    () => books.filter((book) => book.reading_status === 'reading'),
    [books],
  )

  // keep backward compat
  const currentBook = currentBooks[0] ?? null

  return { currentBook, currentBooks, loading, error, refetch }
}
