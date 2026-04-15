import type { Quote } from '@/lib/types/library'

interface QuotesResponse {
  data?: Quote[]
}

export async function fetchQuotes(bookId?: string): Promise<Quote[]> {
  const query = bookId ? `?book_id=${bookId}` : ''
  const response = await fetch(`/api/quotes${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch quotes')
  }

  const payload = (await response.json()) as QuotesResponse
  return payload.data || []
}
