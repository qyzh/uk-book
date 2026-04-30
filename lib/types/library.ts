export interface Author {
  id: string
  name: string
  bio?: string
  nationality?: string
  birth_year?: number
  photo_url?: string
}

export interface Book {
  id: string
  title: string
  isbn?: string
  cover_url?: string
  published_year?: number
  pages?: number
  publisher?: string
  summary?: string
  genre?: string
  sub_genre?: string
  reading_status: string
  language: string
  started_at?: string
  finished_at?: string
  current_page?: number
  authors: Author
}

// ─── Tag System ──────────────────────────────────────────────────

/** Color keys that map to visual badge styles in the UI. */
export type TagColor =
  | 'gray'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'orange'
  | 'pink'

export interface Tag {
  id: string
  name: string
  slug: string
  color: TagColor
  created_at?: string
}

/** Raw row from the quote_tags junction table. */
export interface QuoteTag {
  quote_id: string
  tag_id: string
  tags?: Tag
}

// ─── Quotes ──────────────────────────────────────────────────────

export interface Quote {
  id: string
  book_id: string
  text: string
  page_number?: number
  is_favorite: boolean
  created_at?: string
  books?: { id: string; title: string }
  /** Tags attached to this quote, populated via the quote_tags join. */
  tags?: Tag[]
}
