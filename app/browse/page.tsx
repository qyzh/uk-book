'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search, XCircle } from 'lucide-react'
import Navigation from '@/app/components/Navigation'
import BookCard from '@/app/components/BookCard'
import Loading from '@/app/components/Loading'
import { useBooks } from '@/lib/hooks/useBooks'
import { GENRES } from '@/lib/constants/library'

const SUBGENRE_MAP: Record<string, string> = {
  'horor': 'Horror',
  'histori': 'History',
  'sains': 'Science',
  'filosofi': 'Philosophy',
  'self-develop': 'Self Development',
  'self help': 'Self Development',
  'economic': 'Economics',
}

const normalizeSubGenre = (genre: string): string => {
  const g = genre.toLowerCase().trim()
  if (!g) return ''
  if (SUBGENRE_MAP[g]) return SUBGENRE_MAP[g]
  return g.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function BrowsePage() {
  const { books, loading } = useBooks()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedSubGenre, setSelectedSubGenre] = useState<string>('all')
  const [readingYear, setReadingYear] = useState<string>('all')
  const [readingMonth, setReadingMonth] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('title')
  const [searchQuery, setSearchQuery] = useState('')

  const authors = useMemo(
    () => Array.from(new Map(books.map((b) => [b.authors?.id, b.authors])).values()),
    [books],
  )
  const languages = useMemo(() => Array.from(new Set(books.map((b) => b.language))), [books])
  const statuses = useMemo(() => Array.from(new Set(books.map((b) => b.reading_status))), [books])
  const subGenres = useMemo(
    () =>
      Array.from(
        new Set(
          books
            .flatMap((b) =>
              b.sub_genre
                ? b.sub_genre.split(',').map(normalizeSubGenre).filter(Boolean)
                : []
            )
        )
      ).sort((a, b) => a.localeCompare(b)),
    [books],
  )
  const readingYears = useMemo(() => {
    const years = new Set<number>()
    books.forEach((book) => {
      if (book.started_at) {
        years.add(new Date(book.started_at).getFullYear())
      }
      if (book.finished_at) {
        years.add(new Date(book.finished_at).getFullYear())
      }
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [books])

  const readingMonths = useMemo(() => {
    const months = new Set<number>()
    books.forEach((book) => {
      if (book.started_at) {
        months.add(new Date(book.started_at).getMonth() + 1)
      }
      if (book.finished_at) {
        months.add(new Date(book.finished_at).getMonth() + 1)
      }
    })
    return Array.from(months).sort((a, b) => a - b)
  }, [books])

  const filteredBooks = useMemo(() => {
    let filtered = [...books]

    if (searchQuery.trim()) {
      filtered = filtered.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((b) => b.reading_status === selectedStatus)
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter((b) => b.language === selectedLanguage)
    }

    if (selectedAuthor !== 'all') {
      filtered = filtered.filter((b) => b.authors?.id === selectedAuthor)
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter((b) => b.genre === selectedGenre)
    }

    if (selectedSubGenre !== 'all') {
      filtered = filtered.filter((b) =>
        b.sub_genre
          ? b.sub_genre.split(',').map(normalizeSubGenre).includes(selectedSubGenre)
          : false
      )
    }

    if (readingYear !== 'all') {
      const year = parseInt(readingYear)
      filtered = filtered.filter((b) => {
        const startedYear = b.started_at ? new Date(b.started_at).getFullYear() : null
        const finishedYear = b.finished_at ? new Date(b.finished_at).getFullYear() : null
        return startedYear === year || finishedYear === year
      })
    }

    if (readingMonth !== 'all') {
      const monthIndex = parseInt(readingMonth) - 1
      filtered = filtered.filter((b) => {
        const startedMonth = b.started_at ? new Date(b.started_at).getMonth() : null
        const finishedMonth = b.finished_at ? new Date(b.finished_at).getMonth() : null
        return startedMonth === monthIndex || finishedMonth === monthIndex
      })
    }

    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'author') {
      filtered.sort((a, b) => (a.authors?.name || '').localeCompare(b.authors?.name || ''))
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = a.finished_at ? new Date(a.finished_at).getTime() : a.started_at ? new Date(a.started_at).getTime() : 0
        const dateB = b.finished_at ? new Date(b.finished_at).getTime() : b.started_at ? new Date(b.started_at).getTime() : 0
        return dateB - dateA
      })
    }

    return filtered
  }, [books, selectedStatus, selectedLanguage, selectedAuthor, selectedGenre, selectedSubGenre, readingYear, readingMonth, sortBy])

  const resetFilters = () => {
    setSelectedStatus('all')
    setSelectedLanguage('all')
    setSelectedAuthor('all')
    setSelectedGenre('all')
    setSelectedSubGenre('all')
    setReadingYear('all')
    setReadingMonth('all')
    setSortBy('title')
    setSearchQuery('')
  }

  if (loading) {
    return <Loading text="loading library" fullPage />
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-200">Explore Library</h1>
            <div className="text-slate-500 text-sm">{filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''}</div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-slate-600 hover:border-slate-600 transition"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-slate-600 hover:border-slate-600 transition appearance-none pr-8 cursor-pointer relative"
              style={{ background: 'var(--color-slate-900) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239c9793\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 0.5rem center / 1rem 1rem' }}
            >
              <option value="all">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Genre Dropdown */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-slate-600 hover:border-slate-600 transition appearance-none pr-8 cursor-pointer hidden sm:block"
              style={{ background: 'var(--color-slate-900) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239c9793\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 0.5rem center / 1rem 1rem' }}
            >
              <option value="all">Filter by genre</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Sub Genre Dropdown */}
            <select
              value={selectedSubGenre}
              onChange={(e) => setSelectedSubGenre(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-slate-600 hover:border-slate-600 transition appearance-none pr-8 cursor-pointer hidden md:block"
              style={{ background: 'var(--color-slate-900) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239c9793\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 0.5rem center / 1rem 1rem' }}
            >
              <option value="all">Filter by sub-genre</option>
              {subGenres.map((subGenre) => (
                <option key={subGenre} value={subGenre}>{subGenre}</option>
              ))}
            </select>

            {/* Author Dropdown */}
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-slate-600 hover:border-slate-600 transition appearance-none pr-8 cursor-pointer hidden lg:block"
              style={{ background: 'var(--color-slate-900) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239c9793\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 0.5rem center / 1rem 1rem' }}
            >
              <option value="all">Filter by author</option>
              {authors.map((author) => (
                <option key={author?.id} value={author?.id || ''}>{author?.name}</option>
              ))}
            </select>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-slate-600 hover:border-slate-600 transition appearance-none pr-8 cursor-pointer hidden sm:block"
              style={{ background: 'var(--color-slate-900) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239c9793\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 0.5rem center / 1rem 1rem' }}
            >
              <option value="title">Sort by title</option>
              <option value="author">Sort by author</option>
              <option value="date">Sort by date read</option>
            </select>

            {/* Reset Filters */}
            {(searchQuery || selectedStatus !== 'all' || selectedGenre !== 'all' || selectedLanguage !== 'all' || selectedAuthor !== 'all' || selectedSubGenre !== 'all' || readingYear !== 'all' || readingMonth !== 'all' || sortBy !== 'title') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm ml-2 transition"
              >
                <XCircle className="w-4 h-4" />
                Reset filters
              </button>
            )}
          </div>
        </div>

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

        <footer className="border-t border-slate-700 mt-12 pt-8 pb-12 text-center text-slate-500 text-xs">
          <Link href="/" className="hover:text-slate-400 transition">[← back to home]</Link>
        </footer>
      </main>
    </div>
  )
}
