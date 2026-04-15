'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import CurrentlyReading from '@/app/components/CurrentlyReading'
import Loading from '@/app/components/Loading'
import { useBooks } from '@/lib/hooks/useBooks'
import { useQuoteCarousel } from '@/lib/hooks/useQuoteCarousel'

export default function HomePage() {
  const { books, loading } = useBooks()
  const { quotes, favoriteQuotes, currentQuoteIndex, setCurrentQuoteIndex } = useQuoteCarousel()

  const recentBooks = useMemo(() => books.filter(b => b.reading_status !== 'wishlist').slice(0, 6), [books])
  const wishlistBooks = useMemo(() => books.filter((book) => book.reading_status === 'wishlist'), [books])
  const completedBooks = useMemo(
    () => books.filter((book) => book.reading_status === 'completed'),
    [books],
  )

  if (loading) {
    return <Loading text="loading library" fullPage />
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Currently Reading Feature */}
        <section>
          <CurrentlyReading />
        </section>

        {/* Hero / Featured Quote */}
        {favoriteQuotes.length > 0 && (
          <section className="py-12">
            <div className="border border-slate-700 bg-gradient-to-br from-black to-slate-900 p-8 transition-all duration-500">
              <div className="text-slate-500 text-xs mb-4">✦ favorite quote</div>
              <blockquote className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-6 italic">
                "{favoriteQuotes[currentQuoteIndex % favoriteQuotes.length]?.text}"
              </blockquote>
              {favoriteQuotes[currentQuoteIndex % favoriteQuotes.length]?.books && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>—</span>
                  <Link
                    href={`/books/${favoriteQuotes[currentQuoteIndex % favoriteQuotes.length].book_id}`}
                    className="text-purple-300 hover:text-purple-200 transition"
                  >
                    {favoriteQuotes[currentQuoteIndex % favoriteQuotes.length].books?.title || 'Unknown Book'}
                  </Link>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                {favoriteQuotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuoteIndex(i)}
                    className={`w-2 h-2 rounded-full transition ${i === currentQuoteIndex % favoriteQuotes.length
                        ? 'bg-purple-400'
                        : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'total books', value: books.length },
            { label: 'completed', value: completedBooks.length },
            { label: 'total quotes', value: quotes.length },
            { label: 'favorites', value: favoriteQuotes.length },
          ].map((stat, i) => (
            <div
              key={i}
              className="border border-slate-700 bg-slate-900 bg-opacity-40 p-4 text-center hover:bg-opacity-60 transition"
            >
              <div className="text-slate-500 text-xs uppercase tracking-wide">{stat.label}</div>
              <div className="text-3xl font-bold text-slate-200 mt-2">{stat.value}</div>
            </div>
          ))}
        </section>

        {/* Recent Books */}
        {recentBooks.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
              <span className="text-purple-400">→</span> Library
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group border border-slate-700 hover:border-purple-600 transition overflow-hidden hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="aspect-[3/4] bg-slate-900 relative overflow-hidden">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
                        <div className="text-center px-4">
                          <div className="text-3xl mb-2">📖</div>
                          <div className="text-slate-500 text-xs text-center line-clamp-2">{book.title}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-black">
                    <h3 className="font-bold text-slate-200 line-clamp-2 mb-1 group-hover:text-purple-300 transition">
                      {book.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-3">{book.authors?.name}</p>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{book.published_year || '—'}</span>
                      <span
                        className={`${book.reading_status === 'completed'
                            ? 'text-slate-400'
                            : book.reading_status === 'reading'
                              ? 'text-purple-400'
                              : 'text-slate-600'
                          }`}
                      >
                        [{book.reading_status}]
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Wishlist Section */}
        {wishlistBooks.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
              <span className="text-blue-400">→</span> Wishlist ({wishlistBooks.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group border border-slate-700 hover:border-blue-500 transition overflow-hidden"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-slate-900 relative">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition duration-500 opacity-80 hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="text-2xl">📖</div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-black">
                    <h3 className="font-bold text-slate-300 text-xs line-clamp-2 group-hover:text-blue-300 transition">
                      {book.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Books Grid */}
        {books.filter(b => b.reading_status !== 'wishlist').length > 6 && (
          <section>
            <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
              <span className="text-purple-400">→</span> All Books ({books.filter(b => b.reading_status !== 'wishlist').length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.filter(b => b.reading_status !== 'wishlist').slice(6).map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group border border-slate-700 hover:border-purple-500 transition overflow-hidden"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-slate-900 relative">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="text-2xl">📖</div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-black">
                    <h3 className="font-bold text-slate-300 text-xs line-clamp-2 group-hover:text-purple-300 transition">
                      {book.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-700 pt-8 text-center text-slate-500 text-xs pb-8">
          <p>crafted with ♡ • {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  )
}
