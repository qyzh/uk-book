'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Author {
  id: string
  name: string
}

export default function AddBookPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const GENRES = ['fiction', 'non-fiction']
  const STATUSES = ['to-read', 'reading', 'completed', 'wishlist']

  const [formData, setFormData] = useState({
    title: '',
    author_id: '',
    isbn: '',
    published_year: new Date().getFullYear(),
    pages: '',
    publisher: '',
    language: 'id',
    genre: 'fiction',
    reading_status: 'to-read',
    summary: '',
    started_at: '',
    finished_at: '',
    current_page: '',
  })

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors')
      const { data } = await response.json()
      setAuthors(data || [])
    } catch (error) {
      console.error('Failed to fetch authors:', error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pages' || name === 'published_year' ? parseInt(value) || '' : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.title || !formData.author_id) {
        setError('Title and author are required')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        pages: formData.pages ? parseInt(formData.pages as any) : null,
        published_year: formData.published_year ? parseInt(formData.published_year as any) : null,
        started_at: formData.started_at || null,
        finished_at: formData.finished_at || null,
      }

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create book')
      }

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Book</h1>
          <p className="text-slate-600 mb-8">Track your reading journey</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Book title"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Author *
              </label>
              <select
                name="author_id"
                value={formData.author_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Genre *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {GENRES.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reading Status
              </label>
              <select
                name="reading_status"
                value={formData.reading_status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="to-read">Ready to Read</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
                <option value="wishlist">Wishlist to Buy</option>
              </select>
            </div>

            {/* Start Date */}
            {(formData.reading_status === 'reading' || formData.reading_status === 'completed') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  When did you start reading?
                </label>
                <input
                  type="date"
                  name="started_at"
                  value={formData.started_at}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Format: DD-MM-YYYY</p>
              </div>
            )}

            {/* Finish Date */}
            {formData.reading_status === 'completed' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  When did you finish reading?
                </label>
                <input
                  type="date"
                  name="finished_at"
                  value={formData.finished_at}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Format: DD-MM-YYYY</p>
              </div>
            )}

            {/* Current Page */}
            {formData.reading_status === 'reading' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What page are you on?
                </label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="current_page"
                      value={formData.current_page}
                      onChange={handleInputChange}
                      placeholder="Current page"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  {formData.pages && (
                    <div className="text-sm text-slate-600 whitespace-nowrap">
                      of {formData.pages}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                placeholder="ISBN (optional)"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Published Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Published Year
              </label>
              <input
                type="number"
                name="published_year"
                value={formData.published_year}
                onChange={handleInputChange}
                placeholder="YYYY"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pages */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Pages
              </label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                placeholder="Number of pages"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Publisher */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                placeholder="Publisher (optional)"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Brief summary or description of the book (optional)"
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">Indonesian</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
              >
                {loading ? 'Adding...' : 'Add Book'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
