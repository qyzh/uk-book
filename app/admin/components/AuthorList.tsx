'use client'

import Image from 'next/image'
import { Plus, Users } from 'lucide-react'
import type { Author } from '@/lib/types/library'

interface AuthorListProps {
  authors: Author[]
  onNew: () => void
}

export default function AuthorList({ authors, onNew }: AuthorListProps) {
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30302e] shrink-0">
        <span className="text-xs text-[#87867f]">{authors.length} authors</span>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded transition"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {authors.map(author => (
            <div
              key={author.id}
              className="flex gap-3 p-3 bg-[#1a1918] border border-[#30302e] rounded-lg"
            >
              <div className="w-10 h-14 bg-[#141413] rounded overflow-hidden relative shrink-0">
                {author.photo_url ? (
                  <Image src={author.photo_url} alt={author.name} fill sizes="40px" className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Users className="w-4 h-4 text-[#87867f]" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[#faf9f5] text-sm truncate">{author.name}</div>
                <div className="text-xs text-[#87867f] mt-0.5">{author.nationality ?? '—'}</div>
                {author.bio && (
                  <div className="text-xs text-[#87867f] mt-1 line-clamp-2">{author.bio}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {authors.length === 0 && (
          <div className="flex items-center justify-center h-40 text-[#87867f] text-sm">no authors yet</div>
        )}
      </div>
    </div>
  )
}
