'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'
import Loading from '@/app/components/Loading'
import type { Author } from '@/lib/types/library'

interface AuthorsResponse {
  data?: Author[]
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/authors')
        if (!response.ok) throw new Error('Failed to fetch authors')
        const payload = (await response.json()) as AuthorsResponse
        setAuthors(payload.data || [])
      } catch {
        setAuthors([])
      } finally {
        setLoading(false)
      }
    }

    fetchAuthors()
  }, [])

  if (loading) {
    return <Loading text="loading authors" fullPage />
  }

  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-200">Authors</h1>
            <p className="text-slate-500 text-sm mt-1">{authors.length} author{authors.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/authors/add"
            className="text-xs border border-slate-700 px-3 py-2 text-slate-300 hover:text-slate-200 hover:border-slate-600 transition"
          >
            + add author
          </Link>
        </header>

        {authors.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map((author) => (
              <article key={author.id} className="border border-slate-700 bg-slate-900 bg-opacity-30 p-4 flex gap-4">
                <div className="w-20 h-24 bg-slate-900 border border-slate-700 relative overflow-hidden flex-shrink-0">
                  {author.photo_url ? (
                    <img src={author.photo_url} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">no photo</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold text-slate-200">{author.name}</h2>
                    <Link
                      href={`/authors/${author.id}/edit`}
                      className="text-xs border border-slate-700 px-2 py-1 text-slate-400 hover:text-slate-300 hover:border-slate-600 transition whitespace-nowrap"
                    >
                      edit
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {author.nationality || 'unknown nationality'}
                    {author.birth_year ? ` • born ${author.birth_year}` : ''}
                  </p>
                  {author.bio && (
                    <p className="text-sm text-slate-400 mt-3 line-clamp-4 whitespace-pre-wrap">{author.bio}</p>
                  )}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="border border-slate-700 bg-slate-900 bg-opacity-30 p-12 text-center">
            <div className="text-slate-600 text-sm">no authors yet</div>
          </section>
        )}
      </main>
    </div>
  )
}
