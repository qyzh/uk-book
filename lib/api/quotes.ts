import type { Quote, Tag } from '@/lib/types/library'

// ─── Response shapes ────────────────────────────────────────────────

interface QuotesResponse {
  data?: Quote[]
}

interface QuoteResponse {
  data?: Quote
}

interface TagsResponse {
  data?: Tag[]
}

interface TagResponse {
  data?: Tag
}

// ─── Quotes ─────────────────────────────────────────────────────────

/**
 * Fetch all quotes, optionally filtered by book or tag slug.
 * @param bookId  - Only return quotes for this book.
 * @param tagSlug - Only return quotes that have this tag.
 */
export async function fetchQuotes(bookId?: string, tagSlug?: string): Promise<Quote[]> {
  const params = new URLSearchParams()
  if (bookId) params.set('book_id', bookId)
  if (tagSlug) params.set('tag', tagSlug)

  const query = params.toString() ? `?${params.toString()}` : ''
  const response = await fetch(`/api/quotes${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch quotes')
  }

  const payload = (await response.json()) as QuotesResponse
  return payload.data || []
}

/**
 * Create a new quote and optionally attach tags in one call.
 */
export async function createQuote(payload: {
  book_id: string
  text: string
  page_number?: number
  is_favorite?: boolean
  tag_ids?: string[]
}): Promise<Quote> {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Failed to create quote')
  }

  const { data } = (await response.json()) as QuoteResponse
  if (!data) throw new Error('No data returned')
  return data
}

/**
 * Update a quote's fields and (optionally) replace its full tag list.
 * Pass `tag_ids` to replace; omit it to leave tags unchanged.
 */
export async function updateQuote(
  id: string,
  payload: {
    text?: string
    page_number?: number
    is_favorite?: boolean
    tag_ids?: string[]
  }
): Promise<Quote> {
  const response = await fetch(`/api/quotes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Failed to update quote')
  }

  const { data } = (await response.json()) as QuoteResponse
  if (!data) throw new Error('No data returned')
  return data
}

/**
 * Delete a quote. The `quote_tags` rows are removed automatically via FK cascade.
 */
export async function deleteQuote(id: string): Promise<void> {
  const response = await fetch(`/api/quotes/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Failed to delete quote')
  }
}

// ─── Tags ────────────────────────────────────────────────────────────

/**
 * Fetch all available tags (for populating selectors in forms).
 */
export async function fetchTags(): Promise<Tag[]> {
  const response = await fetch('/api/tags')

  if (!response.ok) {
    throw new Error('Failed to fetch tags')
  }

  const payload = (await response.json()) as TagsResponse
  return payload.data || []
}

/**
 * Create a new tag.
 */
export async function createTag(payload: {
  name: string
  color?: Tag['color']
}): Promise<Tag> {
  const response = await fetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Failed to create tag')
  }

  const { data } = (await response.json()) as TagResponse
  if (!data) throw new Error('No data returned')
  return data
}
