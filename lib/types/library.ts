export interface Author {
  id: string
  name: string
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
  reading_status: string
  language: string
  started_at?: string
  finished_at?: string
  current_page?: number
  authors: Author
}

export interface Quote {
  id: string
  book_id: string
  text: string
  page_number?: number
  is_favorite: boolean
  books?: { id: string; title: string }
}
