'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'
import Loading from '@/app/components/Loading'

interface AuthorPayload {
  id: string
  name: string
  bio?: string
  nationality?: string
  birth_year?: number
  photo_url?: string
}

export default function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    nationality: '',
    birth_year: '',
    photo_url: '',
  })

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/authors/${id}`)
        if (!response.ok) throw new Error('Failed to fetch author')
        const payload = (await response.json()) as { data?: AuthorPayload; error?: string }
        if (!payload.data) throw new Error(payload.error || 'Author not found')
        setFormData({
          name: payload.data.name || '',
          bio: payload.data.bio || '',
          nationality: payload.data.nationality || '',
          birth_year: payload.data.birth_year ? String(payload.data.birth_year) : '',
          photo_url: payload.data.photo_url || '',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch author')
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
          bio: formData.bio || null,
          nationality: formData.nationality || null,
          photo_url: formData.photo_url || null,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string }
        throw new Error(payload.error || 'Failed to update author')
      }

      router.push('/authors')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update author')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-slate-400" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
        <Navigation />
        <div className="flex items-center justify-center py-32">loading author...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="font-serif tracking-tight text-3xl font-bold text-slate-200">Edit Author</h1>
          <p className="text-slate-500 text-sm mt-2">Update author profile and bio.</p>
        </header>

        {error && (
          <div className="border border-red-700 bg-red-900 bg-opacity-20 text-red-300 px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-slate-700 bg-black bg-opacity-30 p-5 space-y-5">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              placeholder="author name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
                placeholder="country"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">birth year</label>
              <input
                type="number"
                name="birth_year"
                value={formData.birth_year}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
                placeholder="1990"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">photo url</label>
            <input
              type="url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 bg-black border border-slate-700 text-slate-300 text-sm outline-none hover:border-slate-600 transition resize-y"
              placeholder="short author bio..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-black transition text-sm font-bold disabled:opacity-50"
            >
              {saving ? 'updating...' : 'update author'}
            </button>
            <Link
              href="/authors"
              className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600 transition text-sm"
            >
              cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
