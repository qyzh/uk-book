'use client'

import { useMemo, useState } from 'react'
import { Quote, Tag as TagIcon } from 'lucide-react'
import Navigation from '@/app/components/Navigation'
import Loading from '@/app/components/Loading'
import QuoteShareButton from '@/app/components/QuoteShareButton'
import { useQuotes } from '@/lib/hooks/useQuotes'
import type { Tag } from '@/lib/types/library'

// ─── Colour map (same palette as the form) ───────────────────────────────────
const TAG_COLORS: Record<string, { bg: string; text: string; activeBg: string; activeText: string; ring: string }> = {
  gray:   { bg: 'bg-slate-800/50',    text: 'text-slate-400',   activeBg: 'bg-slate-700',     activeText: 'text-slate-100',   ring: 'ring-slate-500'   },
  blue:   { bg: 'bg-blue-950/60',     text: 'text-blue-400',    activeBg: 'bg-blue-900',      activeText: 'text-blue-200',    ring: 'ring-blue-500'    },
  green:  { bg: 'bg-emerald-950/60',  text: 'text-emerald-400', activeBg: 'bg-emerald-900',   activeText: 'text-emerald-200', ring: 'ring-emerald-500' },
  yellow: { bg: 'bg-yellow-950/60',   text: 'text-yellow-400',  activeBg: 'bg-yellow-900',    activeText: 'text-yellow-200',  ring: 'ring-yellow-500'  },
  red:    { bg: 'bg-red-950/60',      text: 'text-red-400',     activeBg: 'bg-red-900',       activeText: 'text-red-200',     ring: 'ring-red-500'     },
  purple: { bg: 'bg-purple-950/60',   text: 'text-purple-400',  activeBg: 'bg-purple-900',    activeText: 'text-purple-200',  ring: 'ring-purple-500'  },
  orange: { bg: 'bg-[#d97757]/10',    text: 'text-[#d97757]',   activeBg: 'bg-[#d97757]/30',  activeText: 'text-[#e09e72]',   ring: 'ring-[#d97757]'   },
  pink:   { bg: 'bg-pink-950/60',     text: 'text-pink-400',    activeBg: 'bg-pink-900',      activeText: 'text-pink-200',    ring: 'ring-pink-500'    },
}

function tagColors(color: string) {
  return TAG_COLORS[color] ?? TAG_COLORS.gray
}

// ─── Inline tag badge (for quote cards) ──────────────────────────────────────
function TagPill({ tag }: { tag: Tag }) {
  const c = tagColors(tag.color)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
      {tag.name}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuotesPage() {
  const { quotes, loading } = useQuotes()
  const [selectedBookId, setSelectedBookId] = useState('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTagSlug, setActiveTagSlug] = useState<string | null>(null)

  // ── Derived: unique books from loaded quotes ──────────────────────────────
  const books = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>()
    quotes.forEach((q) => {
      if (q.books?.id) map.set(q.books.id, q.books)
    })
    return Array.from(map.values())
  }, [quotes])

  // ── Derived: unique tags that actually appear on loaded quotes ────────────
  const availableTags = useMemo(() => {
    const map = new Map<string, Tag>()
    quotes.forEach((q) => {
      ;(q.tags ?? []).forEach((t) => {
        if (!map.has(t.slug)) map.set(t.slug, t)
      })
    })
    // Sort by name
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [quotes])

  // ── Filter pipeline ───────────────────────────────────────────────────────
  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return quotes.filter((quote) => {
      if (selectedBookId !== 'all' && quote.book_id !== selectedBookId) return false
      if (favoritesOnly && !quote.is_favorite) return false
      if (activeTagSlug && !(quote.tags ?? []).some((t) => t.slug === activeTagSlug)) return false
      if (query) {
        const inText  = quote.text.toLowerCase().includes(query)
        const inBook  = (quote.books?.title ?? '').toLowerCase().includes(query)
        if (!inText && !inBook) return false
      }
      return true
    })
  }, [quotes, selectedBookId, favoritesOnly, search, activeTagSlug])

  const favoriteCount = useMemo(() => quotes.filter((q) => q.is_favorite).length, [quotes])

  if (loading) return <Loading text="loading quotes" fullPage />

  return (
    <div
      className="min-h-screen bg-black text-slate-100"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      <Navigation />

      <main className="mx-auto pt-20 pb-12">
        {/* ── Header ── */}
        <header className="space-y-2 max-w-7xl mx-auto px-12">
          <h1 className="font-serif tracking-tight text-3xl font-bold text-slate-200 flex items-center gap-2">
            <Quote className="w-8 h-8 text-[#d97757]" />
            All Quotes
          </h1>
          <p className="text-slate-500 text-sm">
            {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''} shown
            &nbsp;•&nbsp;
            {favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}
            {activeTagSlug && (
              <>&nbsp;•&nbsp;<span className="text-[#d97757]">#{activeTagSlug}</span></>
            )}
          </p>
        </header>

        {/* ── Filters ── */}
        <section className="uksection border-y p-12 my-12 space-y-5">
          <div className="max-w-7xl mx-auto px-12 space-y-4">
            {/* Row 1 — text / book / favorites */}
            <div>
              <div className="text-slate-400 text-sm font-bold mb-3">→ filters</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="search text or book title..."
                  className="w-full px-3 py-2 ukboxsecond text-slate-300 text-sm outline-none hover:border-slate-600 transition"
                />
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-3 py-2 ukboxsecond text-slate-300 text-sm outline-none hover:border-slate-600 transition"
                >
                  <option value="all">all books</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 ukboxsecond text-sm">
                  <input
                    type="checkbox"
                    checked={favoritesOnly}
                    onChange={(e) => setFavoritesOnly(e.target.checked)}
                    className="accent-[#d97757]"
                  />
                  favorites only
                </label>
              </div>
            </div>

            {/* Row 2 — tag filter pills (only if any tags exist) */}
            {availableTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TagIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400 text-xs font-bold">filter by tag</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* "All" pill */}
                  <button
                    onClick={() => setActiveTagSlug(null)}
                    className={[
                      'px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition',
                      activeTagSlug === null
                        ? 'bg-slate-700 text-slate-100 ring-1 ring-slate-400'
                        : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800',
                    ].join(' ')}
                  >
                    all
                  </button>

                  {availableTags.map((tag) => {
                    const active = activeTagSlug === tag.slug
                    const c = tagColors(tag.color)
                    return (
                      <button
                        key={tag.slug}
                        onClick={() => setActiveTagSlug(active ? null : tag.slug)}
                        className={[
                          'px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition',
                          active
                            ? `${c.activeBg} ${c.activeText} ring-1 ${c.ring}`
                            : `${c.bg} ${c.text} hover:ring-1 ${c.ring} opacity-70 hover:opacity-100`,
                        ].join(' ')}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Quote cards ── */}
        {filteredQuotes.length > 0 ? (
          <section className="space-y-4 max-w-7xl mx-auto px-12">
            {filteredQuotes.map((quote) => {
              const tags = quote.tags ?? []

              const innerContent = (
                <>
                  {/* Quote text + favorite label */}
                  <div className="flex items-start justify-between gap-3">
                    <blockquote className="text-slate-200 italic leading-relaxed">
                      &ldquo;{quote.text}&rdquo;
                    </blockquote>
                    {quote.is_favorite && (
                      <span className="text-[#d97757] text-[10px] font-bold whitespace-nowrap uppercase tracking-wider">
                        Favorite
                      </span>
                    )}
                  </div>

                  {/* Footer: book / page / tags / share */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Book + page */}
                      <span className="text-xs text-slate-500">
                        {quote.books?.title || 'unknown book'}
                        {quote.page_number && <span className="ml-2">· p.{quote.page_number}</span>}
                      </span>

                      {/* Tag pills */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <button
                              key={tag.id}
                              onClick={() =>
                                setActiveTagSlug(activeTagSlug === tag.slug ? null : tag.slug)
                              }
                              title={`Filter by ${tag.name}`}
                              className="cursor-pointer"
                            >
                              <TagPill tag={tag} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <QuoteShareButton
                      quoteText={quote.text}
                      bookTitle={quote.books?.title || 'Unknown Book'}
                    />
                  </div>
                </>
              )

              // Favorite quotes → spinning gradient border
              if (quote.is_favorite) {
                return (
                  <div key={quote.id} className="relative p-[1px] overflow-hidden rounded-lg group">
                    <div className="absolute top-1/2 left-1/2 aspect-square w-[200%] sm:w-[150%] md:w-[120%] lg:w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#d97757_60%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <article className="relative bg-black h-full w-full rounded-[7px] p-6 z-10">
                      {innerContent}
                    </article>
                  </div>
                )
              }

              return (
                <article
                  key={quote.id}
                  className="border border-slate-800 bg-black bg-opacity-20 p-6 rounded-lg hover:border-slate-700 transition"
                >
                  {innerContent}
                </article>
              )
            })}
          </section>
        ) : (
          <section className="border border-slate-700 bg-black bg-opacity-30 p-12 text-center max-w-7xl mx-auto px-12">
            <div className="text-slate-600 text-sm">no quotes match current filters</div>
            {activeTagSlug && (
              <button
                onClick={() => setActiveTagSlug(null)}
                className="mt-3 text-xs text-[#d97757] hover:underline"
              >
                clear tag filter
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
