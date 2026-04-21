'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import Navigation from '@/app/components/Navigation'
import Loading from '@/app/components/Loading'
import QuoteShareButton from '@/app/components/QuoteShareButton'
import { useQuotes } from '@/lib/hooks/useQuotes'

export default function QuotesPage() {
  const { quotes, loading } = useQuotes()
  const [selectedBookId, setSelectedBookId] = useState('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [search, setSearch] = useState('')

  const books = useMemo(
    () => {
      const mappedBooks = new Map<string, { id: string; title: string }>()
      quotes.forEach((quote) => {
        if (quote.books?.id) {
          mappedBooks.set(quote.books.id, quote.books)
        }
      })
      return Array.from(mappedBooks.values())
    },
    [quotes],
  )

  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase()

    return quotes.filter((quote) => {
      if (selectedBookId !== 'all' && quote.book_id !== selectedBookId) return false
      if (favoritesOnly && !quote.is_favorite) return false
      if (!query) return true

      const text = quote.text.toLowerCase()
      const bookTitle = quote.books?.title?.toLowerCase() || ''
      return text.includes(query) || bookTitle.includes(query)
    })
  }, [quotes, selectedBookId, favoritesOnly, search])

  const favoriteCount = useMemo(
    () => quotes.filter((quote) => quote.is_favorite).length,
    [quotes],
  )

  if (loading) {
    return <Loading text="loading quotes" fullPage />
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-6xl mx-auto px-12 py-8 space-y-8">
        <header className="space-y-2">
          <h1 className="font-serif tracking-tight text-3xl font-bold text-slate-200">All Quotes</h1>
          <p className="text-slate-500 text-sm">
            {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''} shown • {favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}
          </p>
        </header>

        <section className="border border-slate-700 bg-black bg-opacity-30 p-4 space-y-4">
          <div className="text-slate-400 text-sm font-bold">→ filters</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search text or book title..."
              className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
            />
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
            >
              <option value="all">all books</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
                className="accent-purple-500"
              />
              favorites only
            </label>
          </div>
        </section>

        {filteredQuotes.length > 0 ? (
          <section className="space-y-4">
            {filteredQuotes.map((quote) => (
              <article
                key={quote.id}
                className={`border p-5 transition ${quote.is_favorite
                    ? 'border-purple-600 bg-purple-900 bg-opacity-10'
                    : 'border-slate-700 bg-black bg-opacity-20'
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <blockquote className="text-slate-200 italic leading-relaxed">&ldquo;{quote.text}&rdquo;</blockquote>
                  {quote.is_favorite && <span className="text-purple-300 text-xs font-bold whitespace-nowrap">favorite</span>}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <div className="text-xs text-slate-500">
                    <span>book: {quote.books?.title || 'unknown book'}</span>
                    {quote.page_number && <span className="ml-3">page {quote.page_number}</span>}
                  </div>
                  <QuoteShareButton
                    quoteText={quote.text}
                    bookTitle={quote.books?.title || 'Unknown Book'}
                  />
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="border border-slate-700 bg-black bg-opacity-30 p-12 text-center">
            <div className="text-slate-600 text-sm">no quotes match current filters</div>
          </section>
        )}

        <footer className="border-t border-slate-700 pt-8 pb-12 text-center text-slate-500 text-xs">
          <Link href="/" className="hover:text-slate-400 transition">
            [← back to home]
          </Link>
        </footer>
      </main>
    </div>
  )
}
