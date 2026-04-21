'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import Navigation from '@/app/components/Navigation'
import BookCard from '@/app/components/BookCard'
import Loading from '@/app/components/Loading'
import { useBooks } from '@/lib/hooks/useBooks'

export default function WishlistPage() {
  const { books, loading } = useBooks()

  const wishlistBooks = useMemo(() => {
    return books.filter((book) => book.reading_status === 'wishlist')
  }, [books])

  if (loading) {
    return <Loading text="loading wishlist" fullPage />
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-7xl mx-auto px-12 py-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-purple-400 text-xl">★</span>
            <h1 className="font-serif tracking-tight text-3xl font-bold text-slate-200">My Wishlist</h1>
          </div>
          <p className="text-slate-500 text-sm">{wishlistBooks.length} book{wishlistBooks.length !== 1 ? 's' : ''} on my wishlist</p>
        </div>

        {wishlistBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="border border-slate-700 bg-black bg-opacity-30 p-12 text-center">
            <div className="text-purple-400 text-4xl mb-4">☆</div>
            <div className="text-slate-500 text-sm mb-6">your wishlist is empty</div>
            <Link
              href="/browse"
              className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded transition"
            >
              browse books
            </Link>
          </div>
        )}

        <footer className="border-t border-slate-700 mt-12 pt-8 pb-12 text-center text-slate-500 text-xs">
          <Link href="/" className="hover:text-slate-400 transition">
            [← back to home]
          </Link>
        </footer>
      </main>
    </div>
  )
}
