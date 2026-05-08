'use client'

import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import type { Tag } from '@/lib/types/library'

interface Quote {
  id: string
  book_id: string
  text: string
  page_number?: number
  is_favorite: boolean
  books?: { id: string; title: string }
  tags?: Tag[]
}

interface QuoteListProps {
  quotes: Quote[]
  onToggleFavorite: (quote: Quote) => void
  onDelete: (id: string) => void
  onEdit: (quote: Quote) => void
  onNew: () => void
}

// Minimal colour map for tag pills in the list view
const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  gray:   { bg: 'bg-slate-700/60',   text: 'text-slate-300'  },
  blue:   { bg: 'bg-blue-900/50',    text: 'text-blue-300'   },
  green:  { bg: 'bg-emerald-900/50', text: 'text-emerald-300'},
  yellow: { bg: 'bg-yellow-900/50',  text: 'text-yellow-300' },
  red:    { bg: 'bg-red-900/50',     text: 'text-red-300'    },
  purple: { bg: 'bg-purple-900/50',  text: 'text-purple-300' },
  orange: { bg: 'bg-[#d97757]/20',   text: 'text-[#d97757]'  },
  pink:   { bg: 'bg-pink-900/50',    text: 'text-pink-300'   },
}

function tagColors(color: string) {
  return TAG_COLORS[color] ?? TAG_COLORS.gray
}

export default function QuoteList({ quotes, onToggleFavorite, onDelete, onEdit, onNew }: QuoteListProps) {
  const favorites = quotes.filter((q) => q.is_favorite).length

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#30302e] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#87867f]">{quotes.length} quotes</span>
          {favorites > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-yellow-400">
              <PixelArtIcon name="Heart" size={12} className="fill-current" />
              {favorites} favorite{favorites !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded-lg transition shadow-lg shadow-[#d97757]/20"
        >
          <PixelArtIcon name="Plus" size={16} color="white" /> Add Quote
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#30302e]/60">
        {quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <PixelArtIcon name="QuoteTextInline" size={24} className="text-[#30302e]" />
            <span className="text-[#87867f] text-sm">No quotes yet</span>
          </div>
        ) : (
          quotes.map((quote) => (
            <div key={quote.id} className="px-5 py-4 hover:bg-[#1a1918] group transition">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#d97757] bg-[#d97757]/10 px-2 py-0.5 rounded">
                  {quote.books?.title ?? 'Unknown Book'}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onToggleFavorite(quote)}
                    className={`p-1.5 rounded-lg transition ${
                      quote.is_favorite
                        ? 'text-yellow-400 bg-yellow-900/20'
                        : 'text-[#87867f] hover:text-yellow-400 hover:bg-yellow-900/20'
                    }`}
                    title={quote.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <PixelArtIcon name="Heart" size={16} className={quote.is_favorite ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={() => onEdit(quote)}
                    className="p-1.5 rounded-lg text-[#87867f] hover:text-[#d97757] hover:bg-[#d97757]/10 transition opacity-0 group-hover:opacity-100"
                    title="edit"
                  >
                    <PixelArtIcon name="Download" size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(quote.id)}
                    className="p-1.5 rounded-lg text-[#87867f] hover:text-red-400 hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100"
                    title="delete"
                  >
                    <PixelArtIcon name="Delete" size={16} />
                  </button>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-sm text-[#e8e6e1] italic line-clamp-3 leading-relaxed mb-2">
                &ldquo;{quote.text}&rdquo;
              </p>

              {/* Footer: page + tags */}
              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                {quote.page_number && (
                  <span className="text-[11px] text-[#87867f]">p. {quote.page_number}</span>
                )}
                {(quote.tags ?? []).map((tag) => {
                  const c = tagColors(tag.color)
                  return (
                    <span
                      key={tag.id}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}
                    >
                      {tag.name}
                    </span>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
