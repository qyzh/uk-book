'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
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

export default function BrowsePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')

  const authors = Array.from(new Map(books.map(b => [b.authors?.id, b.authors])).values())
  const languages = Array.from(new Set(books.map(b => b.language)))
  const statuses = Array.from(new Set(books.map(b => b.reading_status)))

  useEffect(() => {
    fetchBooks()
  }, [])

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

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(b => b.reading_status === selectedStatus)
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(b => b.language === selectedLanguage)
    }

    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(b => b.authors?.id === selectedAuthor)
    }

    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'author') {
      filtered.sort((a, b) => (a.authors?.name || '').localeCompare(b.authors?.name || ''))
    } else if (sortBy === 'year') {
      filtered.sort((a, b) => (b.published_year || 0) - (a.published_year || 0))
    }

    setFilteredBooks(filtered)
  }, [books, selectedStatus, selectedLanguage, selectedAuthor, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-slate-400" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
        <Navigation />
        <div className="flex items-center justify-center py-32">
          loading library...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Explore Library</h1>
          <p className="text-slate-500 text-sm">{filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Filters */}
        <div className="border border-slate-700 bg-slate-900 bg-opacity-30 p-6 mb-8 space-y-4">
          <div className="text-slate-400 text-sm font-bold mb-4">→ filters</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wide block mb-2">status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              >
                <option value="all">all statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wide block mb-2">language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              >
                <option value="all">all languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wide block mb-2">author</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              >
                <option value="all">all authors</option>
                {authors.map((author) => (
                  <option key={author?.id} value={author?.id || ''}>
                    {author?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wide block mb-2">sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              >
                <option value="title">title</option>
                <option value="author">author</option>
                <option value="year">year</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedStatus('all')
                  setSelectedLanguage('all')
                  setSelectedAuthor('all')
                  setSortBy('title')
                }}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600 text-sm transition font-bold"
              >
                reset
              </button>
            </div>
          </div>
        </div>

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
            <div className="text-slate-600 text-sm">no books match your filters</div>
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
