'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { use } from 'react'
import Navigation from '@/app/components/Navigation'
import BookCard from '@/app/components/BookCard'
import { useBooks } from '@/lib/hooks/useBooks'

export default function CategoryBrowsePage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const { books, loading } = useBooks()
  const { categoryType, categoryValue } = useMemo(() => {
    const parts = Array.isArray(category) ? category : [category]
    return {
      categoryType: parts[0] || '',
      categoryValue: parts[1] || parts[0] || '',
    }
  }, [category])

  const filteredBooks = useMemo(() => {
    if (!categoryType) return []
    let filtered = [...books]

    if (categoryType === 'status') {
      filtered = filtered.filter(b => b.reading_status === categoryValue)
    } else if (categoryType === 'author') {
      filtered = filtered.filter(b => b.authors?.id === categoryValue)
    } else if (categoryType === 'language') {
      filtered = filtered.filter(b => b.language === categoryValue)
    }

    filtered.sort((a, b) => a.title.localeCompare(b.title))
    return filtered
  }, [books, categoryType, categoryValue])

  const getCategoryTitle = () => {
    if (categoryType === 'status') {
      return `Books: ${categoryValue}`
    } else if (categoryType === 'author') {
      const author = books.find(b => b.authors?.id === categoryValue)?.authors
      return `Books by ${author?.name || categoryValue}`
    } else if (categoryType === 'language') {
      return `Books in ${categoryValue.toUpperCase()}`
    }
    return 'Browse'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-slate-400" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
        <Navigation />
        <div className="flex items-center justify-center py-32">
          loading...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 flex items-center gap-4">
          <Link href="/browse" className="text-slate-500 hover:text-slate-400 transition text-sm">
            [← browse all]
          </Link>
          <h1 className="text-3xl font-bold text-slate-200">{getCategoryTitle()}</h1>
        </div>

        <p className="text-slate-500 text-sm mb-8">{filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found</p>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="border border-slate-700 bg-slate-900 bg-opacity-30 p-12 text-center">
            <div className="text-slate-600 text-sm">no books found in this category</div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-700 mt-12 pt-8 pb-12 text-center text-slate-500 text-xs">
          <Link href="/" className="hover:text-slate-400 transition">
            [← back to home]
          </Link>
        </footer>
      </main>
    </div>
  )
}
