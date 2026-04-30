'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Search, Pencil, Trash2, BookOpen } from 'lucide-react'
import type { Book } from '@/lib/types/library'

interface BookListProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  onNew: () => void
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-emerald-900/60 text-emerald-300',
    reading:   'bg-[#d97757]/20 text-[#d97757]',
    wishlist:  'bg-blue-900/60 text-blue-300',
    'to-read': 'bg-slate-700 text-slate-300',
  }
  return (
    <span className={`px-2 py-0.5 text-xs rounded font-medium ${styles[status] ?? styles['to-read']}`}>
      {status}
    </span>
  )
}

export default function BookList({ books, onEdit, onDelete, onNew }: BookListProps) {
  const [search, setSearch] = useState('')

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.authors?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#30302e] shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#87867f]" />
          <input
            type="text"
            placeholder="search books..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#1a1918] border border-[#30302e] text-sm text-[#faf9f5] placeholder:text-[#87867f] rounded outline-none focus:border-[#d97757]"
          />
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#87867f] text-sm">
            no books found
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {filtered.map(book => (
                <tr
                  key={book.id}
                  className="border-b border-[#30302e] hover:bg-[#1f1e1d] cursor-pointer group"
                  onClick={() => onEdit(book)}
                >
                  {/* Cover thumbnail */}
                  <td className="pl-4 py-2 w-12 shrink-0">
                    <div className="w-10 h-14 bg-[#1a1918] rounded overflow-hidden relative shrink-0">
                      {book.cover_url ? (
                        <Image src={book.cover_url} alt={book.title} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="w-4 h-4 text-[#87867f]" />
                        </div>
                      )}
                    </div>
                  </td>
                  {/* Title + Author */}
                  <td className="px-3 py-2">
                    <div className="font-bold text-[#faf9f5] line-clamp-1">{book.title}</div>
                    <div className="text-xs text-[#87867f] mt-0.5">{book.authors?.name}</div>
                  </td>
                  {/* Genre */}
                  <td className="px-2 py-2 hidden md:table-cell">
                    {book.genre && (
                      <span className="px-2 py-0.5 bg-[#1a1918] border border-[#30302e] text-[#87867f] text-xs rounded">
                        {book.genre}
                      </span>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-2 py-2 hidden sm:table-cell">
                    <StatusBadge status={book.reading_status} />
                  </td>
                  {/* Actions */}
                  <td className="pr-4 py-2 w-16">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={e => { e.stopPropagation(); onEdit(book) }}
                        className="p-1.5 rounded text-[#87867f] hover:text-[#d97757] hover:bg-[#1a1918] transition"
                        title="edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onDelete(book.id) }}
                        className="p-1.5 rounded text-[#87867f] hover:text-red-400 hover:bg-red-900/20 transition"
                        title="delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
