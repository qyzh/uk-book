'use client'

import { Plus, Star, Trash2 } from 'lucide-react'

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
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30302e] shrink-0">
        <span className="text-xs text-[#87867f]">{quotes.length} quotes</span>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded transition"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#30302e]">
        {quotes.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#87867f] text-sm">no quotes yet</div>
        ) : quotes.map(quote => (
          <div key={quote.id} className="px-4 py-3 hover:bg-[#1f1e1d] group">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#d97757]">{quote.books?.title}</span>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onToggleFavorite(quote)}
                  className={`p-1 rounded transition ${quote.is_favorite ? 'text-yellow-400' : 'text-[#87867f] hover:text-yellow-400'}`}
                  title={quote.is_favorite ? 'unfavorite' : 'favorite'}
                >
                  <Star className={`w-3.5 h-3.5 ${quote.is_favorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onDelete(quote.id)}
                  className="p-1 rounded text-[#87867f] hover:text-red-400 hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100"
                  title="delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-[#faf9f5] italic line-clamp-2">&ldquo;{quote.text}&rdquo;</p>
            {quote.page_number && (
              <span className="text-xs text-[#87867f] mt-1 block">p. {quote.page_number}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
