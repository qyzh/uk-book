'use client'

import { Plus, Trash2 } from 'lucide-react'
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

const NOTE_TYPE_STYLES: Record<string, string> = {
  summary:  'bg-blue-900/60 text-blue-300',
  analysis: 'bg-[#d97757]/20 text-[#d97757]',
  idea:     'bg-emerald-900/60 text-emerald-300',
  general:  'bg-slate-700 text-slate-300',
}

export default function NoteList({ notes, books, onDelete, onNew }: NoteListProps) {
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30302e] shrink-0">
        <span className="text-xs text-[#87867f]">{notes.length} notes</span>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded transition"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#30302e]">
        {notes.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#87867f] text-sm">no notes yet</div>
        ) : notes.map(note => {
          const book = books.find(b => b.id === note.book_id)
          return (
            <div key={note.id} className="px-4 py-3 hover:bg-[#1f1e1d] group">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#d97757] truncate">{book?.title ?? 'Unknown'}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded shrink-0 ${NOTE_TYPE_STYLES[note.note_type] ?? NOTE_TYPE_STYLES.general}`}>
                    {note.note_type}
                  </span>
                </div>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-1 rounded text-[#87867f] hover:text-red-400 hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100 shrink-0"
                  title="delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-[#faf9f5] line-clamp-2">{note.content}</p>
              <span className="text-xs text-[#87867f] mt-1 block">
                {new Date(note.created_at).toLocaleDateString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
