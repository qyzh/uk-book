'use client'

import { Plus, Star, Trash2, Quote as QuoteIcon } from 'lucide-react'

interface Quote {
  id: string
  book_id: string
  text: string
  page_number?: number
  is_favorite: boolean
  books?: { id: string; title: string }
}

interface QuoteListProps {
  quotes: Quote[]
  onToggleFavorite: (quote: Quote) => void
  onDelete: (id: string) => void
  onNew: () => void
}

export default function QuoteList({ quotes, onToggleFavorite, onDelete, onNew }: QuoteListProps) {
  const favorites = quotes.filter(q => q.is_favorite).length

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#30302e] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#87867f]">{quotes.length} quotes</span>
          {favorites > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-yellow-400">
              <Star className="w-3 h-3 fill-current" />
              {favorites} favorite{favorites !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded-lg transition shadow-lg shadow-[#d97757]/20"
        >
          <Plus className="w-3.5 h-3.5" /> Add Quote
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#30302e]/60">
        {quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <QuoteIcon className="w-8 h-8 text-[#30302e]" />
            <span className="text-[#87867f] text-sm">No quotes yet</span>
          </div>
        ) : quotes.map(quote => (
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
                  <Star className={`w-3.5 h-3.5 ${quote.is_favorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onDelete(quote.id)}
                  className="p-1.5 rounded-lg text-[#87867f] hover:text-red-400 hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100"
                  title="delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quote text */}
            <p className="text-sm text-[#e8e6e1] italic line-clamp-3 leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>

            {/* Footer */}
            {quote.page_number && (
              <span className="text-[11px] text-[#87867f] mt-1.5 block">p. {quote.page_number}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
