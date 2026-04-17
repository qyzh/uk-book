'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import CurrentlyReading from '@/app/components/CurrentlyReading'
import Loading from '@/app/components/Loading'
import RevealSection from '@/app/components/RevealSection'
import { useBooks } from '@/lib/hooks/useBooks'
import { useQuoteCarousel } from '@/lib/hooks/useQuoteCarousel'
import { getShortId } from '@/lib/utils/slug'

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
        <RevealSection as="section" variant="up" threshold={0.05}>
          <CurrentlyReading />
        </RevealSection>

        {/* Hero / Featured Quote */}
        {favoriteQuotes.length > 0 && (
          <RevealSection as="section" variant="right" className="py-12">
            <div className="border border-slate-700 bg-gradient-to-br from-black to-slate-900 p-8 transition-all duration-500 flex flex-col min-h-[320px] relative overflow-hidden">
              {/* Giant Background Quote Icon */}
              <div className="absolute -top-4 left-4 text-slate-700 opacity-20 select-none pointer-events-none font-serif text-[240px] leading-none z-0">
                &ldquo;
              </div>

              <div className="text-slate-500 text-xs shrink-0 relative z-10">✦ favorite quote</div>
              
              <div 
                key={currentQuoteIndex}
                className="flex-grow flex flex-col justify-center py-6 relative z-10 animate-fade-in-up"
              >
                <blockquote className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-6 italic">
                  "{favoriteQuotes[currentQuoteIndex % favoriteQuotes.length]?.text}"
                </blockquote>
                {favoriteQuotes[currentQuoteIndex % favoriteQuotes.length]?.books && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm not-italic mt-2">
                    <span>—</span>
                    <Link
                      href={`/books/${getShortId(favoriteQuotes[currentQuoteIndex % favoriteQuotes.length].book_id)}`}
                      className="text-purple-300 hover:text-purple-200 transition"
                    >
                      {favoriteQuotes[currentQuoteIndex % favoriteQuotes.length].books?.title || 'Unknown Book'}
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-2 shrink-0">
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
          </RevealSection>
        )}

        {/* Stats */}
        <RevealSection as="section" variant="up" delay={100} stagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'total books', value: books.filter(b => b.reading_status !== 'wishlist').length },
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
        </RevealSection>

        {/* Recent Books */}
        {recentBooks.length > 0 && (
          <RevealSection as="section" variant="up" threshold={0.05}>
            <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
              <span className="text-purple-400">→</span> Library
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {recentBooks.map((book) => (
                  <Link
                  key={book.id}
                  href={`/books/${getShortId(book.id)}`}
                  className="group block transition duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] bg-slate-900 relative overflow-hidden rounded-r-2xl rounded-l-md border border-slate-700 border-l-[4px] border-l-slate-800 shadow-[5px_5px_15px_rgba(0,0,0,0.8),_0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[5px_5px_20px_rgba(0,0,0,0.8),_0_0_20px_rgba(168,85,247,0.3)] transition-shadow">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="text-center px-4">
                          <div className="text-3xl mb-2">📖</div>
                          <div className="text-slate-500 text-xs text-center line-clamp-2">{book.title}</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-r-2xl rounded-l-md pointer-events-none"></div>
                  </div>
                  <div className="pt-4 bg-transparent text-left">
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
          </RevealSection>
        )}

        {/* Wishlist Section */}
        {wishlistBooks.length > 0 && (
          <RevealSection as="section" variant="left" threshold={0.05}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                <span className="text-purple-400">→</span> Wishlist ({wishlistBooks.length})
              </h2>
              {wishlistBooks.length > 4 && (
                <Link href="/wishlist" className="text-xs text-purple-400 hover:text-purple-300 transition">
                  see all <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 reveal-stagger">
              {wishlistBooks.slice(0, 4).map((book) => (
                  <Link
                  key={book.id}
                  href={`/books/${getShortId(book.id)}`}
                  className="group block transition duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] bg-slate-900 relative overflow-hidden rounded-r-xl rounded-l-sm border border-slate-700 border-l-[3px] border-l-slate-800 shadow-[5px_5px_15px_rgba(0,0,0,0.8),_0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[5px_5px_20px_rgba(0,0,0,0.8),_0_0_20px_rgba(168,85,247,0.3)] transition-shadow">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-500 opacity-90 hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="text-2xl">📖</div>
                      </div>
                    )}
                    <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-r-xl rounded-l-sm pointer-events-none"></div>
                  </div>
                  <div className="pt-3 bg-transparent text-left">
                    <h3 className="font-bold text-slate-300 text-xs line-clamp-2 group-hover:text-purple-300 transition">
                      {book.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </RevealSection>
        )}

        {/* All Books Grid */}
        {books.filter(b => b.reading_status !== 'wishlist').length > 6 && (
          <RevealSection as="section" variant="up" threshold={0.05}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                <span className="text-purple-400">→</span> All Books ({books.filter(b => b.reading_status !== 'wishlist').length})
              </h2>
              {books.filter(b => b.reading_status !== 'wishlist').length > 14 && (
                <Link href="/browse" className="text-xs text-purple-400 hover:text-purple-300 transition">
                  see all <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 reveal-stagger">
              {books.filter(b => b.reading_status !== 'wishlist').slice(6, 14).map((book) => (
                  <Link
                  key={book.id}
                  href={`/books/${getShortId(book.id)}`}
                  className="group block transition duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] bg-slate-900 relative overflow-hidden rounded-r-xl rounded-l-sm border border-slate-700 border-l-[3px] border-l-slate-800 shadow-[5px_5px_15px_rgba(0,0,0,0.8),_0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[5px_5px_20px_rgba(0,0,0,0.8),_0_0_20px_rgba(168,85,247,0.3)] transition-shadow">
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="text-2xl">📖</div>
                      </div>
                    )}
                    <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-r-xl rounded-l-sm pointer-events-none"></div>
                  </div>
                  <div className="pt-3 bg-transparent text-left">
                    <h3 className="font-bold text-slate-300 text-xs line-clamp-2 group-hover:text-purple-300 transition">
                      {book.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </RevealSection>
        )}

        {/* Footer */}
        <RevealSection as="footer" variant="up" delay={200} className="border-t border-slate-700 pt-8 text-center text-slate-500 text-xs pb-8">
          <p>crafted with ♡ • {new Date().getFullYear()}</p>
        </RevealSection>
      </main>
    </div>
  )
}
