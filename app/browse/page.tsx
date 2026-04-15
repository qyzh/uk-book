'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import Navigation from '@/app/components/Navigation'
import BookCard from '@/app/components/BookCard'
import { useBooks } from '@/lib/hooks/useBooks'

export default function BrowsePage() {
  const { books, loading } = useBooks()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all')
  const [selectedSubGenre, setSelectedSubGenre] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')

  const authors = useMemo(
    () => Array.from(new Map(books.map((b) => [b.authors?.id, b.authors])).values()),
    [books],
  )
  const languages = useMemo(() => Array.from(new Set(books.map((b) => b.language))), [books])
  const statuses = useMemo(() => Array.from(new Set(books.map((b) => b.reading_status))), [books])
  const subGenres = useMemo(
    () =>
      Array.from(
        new Set(books.map((b) => b.sub_genre).filter((value): value is string => Boolean(value))),
      ),
    [books],
  )

  const filteredBooks = useMemo(() => {
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

    if (selectedSubGenre !== 'all') {
      filtered = filtered.filter((b) => b.sub_genre === selectedSubGenre)
    }

    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'author') {
      filtered.sort((a, b) => (a.authors?.name || '').localeCompare(b.authors?.name || ''))
    } else if (sortBy === 'year') {
      filtered.sort((a, b) => (b.published_year || 0) - (a.published_year || 0))
    }

    return filtered
  }, [books, selectedStatus, selectedLanguage, selectedAuthor, selectedSubGenre, sortBy])

  const resetFilters = () => {
    setSelectedStatus('all')
    setSelectedLanguage('all')
    setSelectedAuthor('all')
    setSelectedSubGenre('all')
    setSortBy('title')
  }

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
              <label className="text-xs text-slate-500 uppercase tracking-wide block mb-2">sub-genre</label>
              <select
                value={selectedSubGenre}
                onChange={(e) => setSelectedSubGenre(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              >
                <option value="all">all sub-genres</option>
                {subGenres.map((subGenre) => (
                  <option key={subGenre} value={subGenre}>
                    {subGenre}
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
                onClick={resetFilters}
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
              <BookCard key={book.id} book={book} />
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
