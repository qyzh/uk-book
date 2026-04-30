'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Quote } from 'lucide-react'
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

      <main className="mx-auto pt-20 pb-12">
        <header className="space-y-2 max-w-7xl mx-auto px-12">
          <h1 className="font-serif tracking-tight text-3xl font-bold text-slate-200 flex items-center gap-2">
            <Quote className="w-8 h-8 text-[#d97757]" />
            All Quotes
          </h1>
          <p className="text-slate-500 text-sm">
            {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''} shown • {favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}
          </p>
        </header>

        <section className="uksection border-y p-12 my-12 space-y-4">
          <div className="max-w-7xl mx-auto px-12">
            <div className="text-slate-400 text-sm font-bold">→ filters</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search text or book title..."
                className="w-full px-3 py-2 ukboxsecond text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              />
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-3 py-2 ukboxsecond text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              >
                <option value="all">all books</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 ukboxsecond text-sm">
                <input
                  type="checkbox"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                  className="accent-[#d97757]"
                />
                favorites only
              </label>
            </div>
          </div>
        </section>

        {filteredQuotes.length > 0 ? (
          <section className="space-y-4 max-w-7xl mx-auto px-12">
            {filteredQuotes.map((quote) => {
              const innerContent = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <blockquote className="text-slate-200 italic leading-relaxed">&ldquo;{quote.text}&rdquo;</blockquote>
                    {quote.is_favorite && <span className="text-[#d97757] text-[10px] font-bold whitespace-nowrap uppercase tracking-wider">Favorite</span>}
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
                </>
              )

              if (quote.is_favorite) {
                return (
                  <div key={quote.id} className="relative p-[1px] overflow-hidden rounded-lg group">
                    {/* Spinning Gradient Border */}
                    <div className="absolute top-1/2 left-1/2 aspect-square w-[200%] sm:w-[150%] md:w-[120%] lg:w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#d97757_60%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Inner Content */}
                    <article className="relative bg-black h-full w-full rounded-[7px] p-6 z-10">
                      {innerContent}
                    </article>
                  </div>
                )
              }

              return (
                <article key={quote.id} className="border border-slate-800 bg-black bg-opacity-20 p-6 rounded-lg hover:border-slate-700 transition">
                  {innerContent}
                </article>
              )
            })}
          </section>
        ) : (
          <section className="border border-slate-700 bg-black bg-opacity-30 p-12 text-center">
            <div className="text-slate-600 text-sm">no quotes match current filters</div>
          </section>
        )}
      </main>
    </div>
  )
}
