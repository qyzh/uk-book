'use client'

import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import type { Book } from '@/lib/types/library'

interface Note {
  id: string
  book_id: string
  content: string
  note_type: string
  created_at: string
  updated_at: string
}

interface NoteListProps {
  notes: Note[]
  books: Book[]
  onDelete: (id: string) => void
  onNew: () => void
}

const NOTE_TYPE_CONFIG: Record<string, { label: string; text: string; bg: string; dot: string }> = {
  summary:  { label: 'Summary',  text: 'text-blue-300',    bg: 'bg-blue-900/30',    dot: 'bg-blue-400' },
  analysis: { label: 'Analysis', text: 'text-[#d97757]',   bg: 'bg-[#d97757]/10',   dot: 'bg-[#d97757]' },
  idea:     { label: 'Idea',     text: 'text-emerald-300', bg: 'bg-emerald-900/30', dot: 'bg-emerald-400' },
  general:  { label: 'General',  text: 'text-slate-300',   bg: 'bg-slate-800/60',   dot: 'bg-slate-400' },
}

function NoteTypeBadge({ type }: { type: string }) {
  const cfg = NOTE_TYPE_CONFIG[type] ?? NOTE_TYPE_CONFIG.general
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] rounded-md font-bold ${cfg.text} ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

export default function NoteList({ notes, books, onDelete, onNew }: NoteListProps) {
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#30302e] shrink-0">
        <span className="text-xs text-[#87867f]">{notes.length} notes</span>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded-lg transition shadow-lg shadow-[#d97757]/20"
        >
          <PixelArtIcon name="Plus" size={16} color="white" /> Add Note
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#30302e]/60">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <PixelArtIcon name="Notebook" size={24} className="text-[#30302e]" />
            <span className="text-[#87867f] text-sm">No notes yet</span>
          </div>
        ) : notes.map(note => {
          const book = books.find(b => b.id === note.book_id)
          return (
            <div key={note.id} className="px-5 py-4 hover:bg-[#1a1918] group transition">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className="text-[11px] font-bold text-[#d97757] bg-[#d97757]/10 px-2 py-0.5 rounded truncate max-w-[150px]">
                    {book?.title ?? 'Unknown Book'}
                  </span>
                  <NoteTypeBadge type={note.note_type} />
                </div>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-1.5 rounded-lg text-[#87867f] hover:text-red-400 hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100 shrink-0"
                  title="delete"
                >
                  <PixelArtIcon name="Delete" size={16} />
                </button>
              </div>

              {/* Content */}
              <p className="text-sm text-[#e8e6e1] line-clamp-3 leading-relaxed">{note.content}</p>

              {/* Date */}
              <span className="text-[11px] text-[#87867f] mt-1.5 block">
                {new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
