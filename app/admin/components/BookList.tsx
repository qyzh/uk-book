'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import type { Book } from '@/lib/types/library'
import { Badge } from '@/app/components/Badge'

interface BookListProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  onNew: () => void
}

type StatusFilter = 'all' | 'reading' | 'completed' | 'wishlist' | 'to-read'

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'reading',   label: 'Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'to-read',   label: 'To Read' },
  { value: 'wishlist',  label: 'Wishlist' },
]

export default function BookList({ books, onEdit, onDelete, onNew }: BookListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = books.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.authors?.name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.reading_status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#30302e] shrink-0">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87867f]">
            <PixelArtIcon name="Search" size={16} />
          </div>
          <input
            type="text"
            placeholder="Search books or authors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#1a1918] border border-[#30302e] text-sm text-[#faf9f5] placeholder:text-[#87867f] rounded-lg outline-none focus:border-[#d97757] transition"
          />
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded-lg transition shadow-lg shadow-[#d97757]/20 shrink-0"
        >
          <PixelArtIcon name="Plus" size={16} color="white" /> Add Book
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-[#30302e] shrink-0 overflow-x-auto">
        {STATUS_FILTERS.map(({ value, label }) => {
          const counts: Record<StatusFilter, number> = {
            all:       books.length,
            reading:   books.filter(b => b.reading_status === 'reading').length,
            completed: books.filter(b => b.reading_status === 'completed').length,
            'to-read': books.filter(b => b.reading_status === 'to-read').length,
            wishlist:  books.filter(b => b.reading_status === 'wishlist').length,
          }
          const active = statusFilter === value
          const dotColor: Record<StatusFilter, string> = {
            all:       '#87867f',
            reading:   '#eab308',
            completed: '#22c55e',
            'to-read': '#87867f',
            wishlist:  '#3b82f6',
          }
          return (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition border ${
                active
                  ? 'bg-[#d97757]/15 border-[#d97757]/50 text-[#d97757]'
                  : 'bg-transparent border-[#30302e] text-[#87867f] hover:border-[#87867f] hover:text-[#faf9f5]'
              }`}
            >
              {value !== 'all' && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: dotColor[value] }}
                />
              )}
              {label}
              <span className={`text-[10px] ${active ? 'text-[#d97757]/70' : 'text-[#87867f]/60'}`}>
                {counts[value]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Count bar */}
      <div className="px-5 py-2 border-b border-[#30302e]/50 shrink-0">
        <span className="text-[11px] text-[#87867f]">
          {filtered.length} {filtered.length === 1 ? 'book' : 'books'}{search && ` matching "${search}"`}{statusFilter !== 'all' && !search && ` · ${STATUS_FILTERS.find(f => f.value === statusFilter)?.label}`}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <PixelArtIcon name="BookOpen" size={24} className="text-[#30302e]" />
            <span className="text-[#87867f] text-sm">No books found</span>
          </div>
        ) : (
          <div className="divide-y divide-[#30302e]/60">
            {filtered.map(book => (
              <div
                key={book.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-[#1a1918] cursor-pointer group transition"
                onClick={() => onEdit(book)}
              >
                {/* Cover thumbnail */}
                <div className="w-10 h-14 bg-[#1f1e1d] rounded-md overflow-hidden relative shrink-0 shadow-md">
                  {book.cover_url ? (
                    <Image src={book.cover_url} alt={book.title} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <PixelArtIcon name="BookOpen" size={16} className="text-[#87867f]" />
                    </div>
                  )}
                </div>

                {/* Title + Author */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#faf9f5] text-sm line-clamp-1">{book.title}</div>
                  <div className="text-xs text-[#87867f] mt-0.5">{book.authors?.name ?? '—'}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={book.reading_status}>
                      {book.reading_status}
                    </Badge>
                    {book.genre && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#1f1e1d] border border-[#30302e] text-[#87867f] rounded">
                        {book.genre}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); onEdit(book) }}
                    className="p-2 rounded-lg text-[#87867f] hover:text-[#d97757] hover:bg-[#d97757]/10 transition"
                    title="edit"
                  >
                    <PixelArtIcon name="Download" size={16} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(book.id) }}
                    className="p-2 rounded-lg text-[#87867f] hover:text-red-400 hover:bg-red-900/20 transition"
                    title="delete"
                  >
                    <PixelArtIcon name="Delete" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
