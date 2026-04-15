'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { use } from 'react'
import Navigation from '@/app/components/Navigation'

interface Author {
  id: string
  name: string
}

interface Book {
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

export default function CategoryBrowsePage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryType, setCategoryType] = useState<string>('')
  const [categoryValue, setCategoryValue] = useState<string>('')

  useEffect(() => {
    if (!category) return

    const parts = Array.isArray(category) ? category : [category]
    const type = parts[0]
    const value = parts[1] || parts[0]

    setCategoryType(type)
    setCategoryValue(value)
  }, [category])

  useEffect(() => {
    if (!categoryType) return
    fetchBooks()
  }, [categoryType])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books')
      const { data } = await response.json()
      setBooks(data || [])
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...books]

    if (categoryType === 'status') {
      filtered = filtered.filter(b => b.reading_status === categoryValue)
    } else if (categoryType === 'author') {
      filtered = filtered.filter(b => b.authors?.id === categoryValue)
    } else if (categoryType === 'language') {
      filtered = filtered.filter(b => b.language === categoryValue)
    }

    filtered.sort((a, b) => a.title.localeCompare(b.title))
    setFilteredBooks(filtered)
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
                  <p className="text-slate-500 text-sm mb-2 line-clamp-1">{book.authors?.name}</p>
                  
                  {/* Summary Preview */}
                  {book.summary && (
                    <p className="text-slate-600 text-xs mb-3 line-clamp-2">{book.summary}</p>
                  )}

                  {/* Status Badge */}
                  <div className="mb-2 inline-block">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        book.reading_status === 'completed'
                          ? 'bg-emerald-900 text-emerald-300'
                          : book.reading_status === 'reading'
                          ? 'bg-purple-900 text-purple-300'
                          : book.reading_status === 'wishlist'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {book.reading_status}
                    </span>
                  </div>

                  {/* Reading Dates */}
                  <div className="space-y-1 text-xs text-slate-600 mb-3">
                    {book.started_at && (
                      <div>started: {new Date(book.started_at).toLocaleDateString('en-GB')}</div>
                    )}
                    {book.finished_at && (
                      <div>finished: {new Date(book.finished_at).toLocaleDateString('en-GB')}</div>
                    )}
                    {book.reading_status === 'reading' && book.current_page && book.pages && (
                      <div className="space-y-1">
                        <div>page {book.current_page} of {book.pages}</div>
                        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full"
                            style={{ width: `${(book.current_page / book.pages) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-800">
                    <span>{book.published_year || '—'}</span>
                    <span>{book.genre || 'unknown'}</span>
                  </div>
                </div>
              </Link>
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
