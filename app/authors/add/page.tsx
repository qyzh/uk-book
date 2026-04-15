'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

export default function AddAuthorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    nationality: '',
    birth_year: new Date().getFullYear().toString(),
    photo_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
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
        throw new Error(payload.error || 'Failed to add author')
      }

      router.push('/authors')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add author')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-200">Add Author</h1>
          <p className="text-slate-500 text-sm mt-2">Create full author profile: bio, picture, nationality, and birth year.</p>
        </header>

        {error && (
          <div className="border border-red-700 bg-red-900 bg-opacity-20 text-red-300 px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-slate-700 bg-slate-900 bg-opacity-30 p-5 space-y-5">
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
            {formData.photo_url && (
              <div className="mt-3 w-24 h-32 border border-slate-700 relative overflow-hidden">
                <Image src={formData.photo_url} alt="Author preview" fill className="object-cover" />
              </div>
            )}
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
              disabled={loading}
              className="px-4 py-2 border border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-black transition text-sm font-bold disabled:opacity-50"
            >
              {loading ? 'saving...' : 'save author'}
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
