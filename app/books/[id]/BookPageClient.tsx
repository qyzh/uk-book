'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import Loading from '@/app/components/Loading'
import BookShareButton from '@/app/components/BookShareButton'

interface Author {
  id: string
  name: string
  bio?: string
  nationality?: string
}

export interface BookData {
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

interface Quote {
  id: string
  book_id: string
  text: string
  page_number?: number
  is_favorite: boolean
}

interface Props {
  bookId: string
  initialBook?: BookData | null
}

export default function BookPageClient({ bookId, initialBook }: Props) {
  const [book, setBook] = useState<BookData | null>(initialBook ?? null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(!initialBook)
  const [bookNotFound, setBookNotFound] = useState(false)

  useEffect(() => {
    const fetchQuotes = async (id: string) => {
      try {
        const response = await fetch(`/api/quotes?book_id=${id}`)
        const { data } = await response.json()
        setQuotes(data || [])
      } catch (error) {
        console.error('Failed to fetch quotes:', error)
      }
    }

    if (initialBook) {
      // Book data was server-rendered; only fetch quotes client-side
      fetchQuotes(bookId)
      return
    }

    // Fallback: full client-side fetch (short ID scenario)
    const fetchBook = async (id: string) => {
      try {
        const response = await fetch(`/api/books/${id}`)
        if (!response.ok) {
          setBookNotFound(true)
          return null
        }
        const { data } = await response.json()
        setBook(data)
        return data
      } catch (error) {
        console.error('Failed to fetch book:', error)
        setBookNotFound(true)
        return null
      }
    }

    const resolveShortId = async (shortId: string) => {
      try {
        const response = await fetch(`/api/books/short/${shortId}`)
        if (response.ok) {
          const { id: fullId } = await response.json()
          return fullId
        }
      } catch {
        // ignore
      }
      return null
    }

    const loadBook = async () => {
      let targetId = bookId

      if (bookId.length === 4) {
        const fullId = await resolveShortId(bookId)
        if (fullId) {
          window.history.replaceState(null, '', `/books/${fullId}`)
          targetId = fullId
        } else {
          setBookNotFound(true)
          setLoading(false)
          return
        }
      }

      const bookData = await fetchBook(targetId)
      if (bookData) {
        await fetchQuotes(targetId)
      }
      setLoading(false)
    }

    loadBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  if (loading) {
    return <Loading text="loading book" fullPage />
  }

  if (bookNotFound || !book) {
    return (
      <div className="min-h-screen bg-black text-slate-300" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
        <Navigation />
        <div className="flex items-center justify-center py-32 text-center">
          <div className="text-slate-600">book not found</div>
        </div>
      </div>
    )
  }

  const favoriteQuotes = quotes.filter(q => q.is_favorite)

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-6xl mx-auto px-12 py-8 space-y-12">
        {/* Book Hero */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cover & Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="aspect-[3/4] bg-black relative overflow-hidden rounded-r-2xl rounded-l-md border border-slate-700 border-l-[4px] border-l-slate-800 shadow-[10px_10px_30px_rgba(0,0,0,0.8),_0_0_20px_rgba(168,85,247,0.15)] group">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-6xl text-slate-600">📖</div>
                </div>
              )}
              {/* Book Spine Highlight & Lighting Effects */}
              <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
              <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20 pointer-events-none mix-blend-overlay"></div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-r-2xl rounded-l-md pointer-events-none"></div>
            </div>

            {/* Share Button */}
            <div className="flex justify-center">
              <BookShareButton
                book={book}
                status={book.reading_status === 'completed' ? 'completed' : book.reading_status === 'reading' ? 'reading' : book.reading_status === 'wishlist' ? 'wishlist' : 'to-read'}
              />
            </div>

            {/* Book Metadata Card */}
            <div className="border border-slate-700 bg-black bg-opacity-40 p-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">status</div>
                <div
                  className={`text-sm font-bold inline-block px-2 py-1 rounded ${book.reading_status === 'completed'
                      ? 'bg-emerald-900 text-emerald-300'
                      : book.reading_status === 'reading'
                        ? 'bg-purple-900 text-purple-300 animate-pulse'
                        : book.reading_status === 'wishlist'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-slate-800 text-slate-300'
                    }`}
                >
                  {book.reading_status}
                </div>
              </div>

              {book.genre && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">genre</div>
                  <div className="text-sm text-slate-300">{book.genre}</div>
                </div>
              )}

              {book.sub_genre && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">sub-genre</div>
                  <div className="text-sm text-slate-300">{book.sub_genre}</div>
                </div>
              )}

              {book.started_at && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">started</div>
                  <div className="text-sm text-slate-300">{new Date(book.started_at).toLocaleDateString('en-GB')}</div>
                </div>
              )}

              {book.finished_at && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">finished</div>
                  <div className="text-sm text-slate-300">{new Date(book.finished_at).toLocaleDateString('en-GB')}</div>
                </div>
              )}

              {book.published_year && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">published</div>
                  <div className="text-sm text-slate-300">{book.published_year}</div>
                </div>
              )}

              {book.publisher && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">publisher</div>
                  <div className="text-sm text-slate-300">{book.publisher}</div>
                </div>
              )}

              {book.pages && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">pages</div>
                  <div className="text-sm text-slate-300">{book.pages}</div>
                </div>
              )}

              {book.reading_status === 'reading' && book.current_page && book.pages && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">progress</div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-300">
                      Page {book.current_page} of {book.pages}
                      {` (${Math.round((book.current_page / book.pages) * 100)}%)`}
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all"
                        style={{ width: `${(book.current_page / book.pages) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {book.isbn && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">isbn</div>
                  <div className="text-sm text-slate-300 font-mono">{book.isbn}</div>
                </div>
              )}

              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">language</div>
                <div className="text-sm text-slate-300">{book.language.toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Title & Author */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h1 className="font-serif tracking-tight text-4xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
                {book.title}
              </h1>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">by</p>
                  <p className="text-lg text-purple-300">{book.authors?.name}</p>
                </div>

                {book.authors?.nationality && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">author from</div>
                    <p className="text-slate-300">{book.authors.nationality}</p>
                  </div>
                )}

                {book.authors?.bio && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">about author</div>
                    <p className="text-slate-400 leading-relaxed">{book.authors.bio}</p>
                  </div>
                )}

                {book.summary && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">blurb</div>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{book.summary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-slate-700 bg-black bg-opacity-40 p-3 text-center">
                <div className="text-2xl font-bold text-slate-200">{quotes.length}</div>
                <div className="text-xs text-slate-500 mt-1">quotes</div>
              </div>
              <div className="border border-slate-700 bg-black bg-opacity-40 p-3 text-center">
                <div className="text-2xl font-bold text-slate-200">{favoriteQuotes.length}</div>
                <div className="text-xs text-slate-500 mt-1">favorites</div>
              </div>
              <div className="border border-slate-700 bg-black bg-opacity-40 p-3 text-center">
                <div className="text-2xl font-bold text-slate-200">{book.pages || '—'}</div>
                <div className="text-xs text-slate-500 mt-1">pages</div>
              </div>
            </div>
          </div>
        </section>

        {/* Favorite Quotes Highlight */}
        {favoriteQuotes.length > 0 && (
          <section className="border-t border-slate-700 pt-12">
            <h2 className="text-xl font-bold text-slate-300 mb-8 flex items-center gap-2">
              <span className="text-purple-400">♡</span> Favorite Quotes ({favoriteQuotes.length})
            </h2>
            <div className="space-y-4">
              {favoriteQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border-l-4 border-purple-600 bg-black bg-opacity-40 p-6 hover:bg-opacity-60 transition"
                >
                  <blockquote className="text-lg text-slate-200 italic leading-relaxed mb-3">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  {quote.page_number && (
                    <div className="text-xs text-slate-500">page {quote.page_number}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Quotes */}
        {quotes.length > 0 && (
          <section className="border-t border-slate-700 pt-12">
            <h2 className="text-xl font-bold text-slate-300 mb-8 flex items-center gap-2">
              <span className="text-slate-500">→</span> All Quotes ({quotes.length})
            </h2>
            <div className="space-y-4">
              {quotes.filter(q => !q.is_favorite).map((quote) => (
                <div
                  key={quote.id}
                  className="border border-slate-700 bg-black bg-opacity-20 p-4 hover:bg-opacity-40 transition"
                >
                  <blockquote className="text-slate-200 italic leading-relaxed mb-2">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  {quote.page_number && (
                    <div className="text-xs text-slate-500">page {quote.page_number}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Quotes */}
        {quotes.length === 0 && (
          <section className="border-t border-slate-700 pt-12 text-center">
            <div className="text-slate-600 py-12">no quotes captured yet from this book</div>
          </section>
        )}

        {/* Footer Navigation */}
        <footer className="border-t border-slate-700 pt-8 pb-12 text-center">
          <Link
            href="/browse"
            className="text-slate-500 hover:text-slate-400 text-sm transition"
          >
            [explore more books]
          </Link>
        </footer>
      </main>
    </div>
  )
}
