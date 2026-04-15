import type { Book } from '@/lib/types/library'

interface BooksResponse {
  data?: Book[]
}

export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch('/api/books')
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }

  const payload = (await response.json()) as BooksResponse
  return payload.data || []
}
