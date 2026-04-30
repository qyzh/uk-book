'use client'

import Image from 'next/image'
import { Plus, Users, Globe } from 'lucide-react'
import type { Author } from '@/lib/types/library'

interface AuthorListProps {
  authors: Author[]
  onNew: () => void
}

export default function AuthorList({ authors, onNew }: AuthorListProps) {
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#30302e] shrink-0">
        <span className="text-xs text-[#87867f]">{authors.length} authors</span>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#d97757] hover:bg-[#e09e72] text-white text-xs font-bold rounded-lg transition shadow-lg shadow-[#d97757]/20"
        >
          <Plus className="w-3.5 h-3.5" /> Add Author
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        {authors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Users className="w-8 h-8 text-[#30302e]" />
            <span className="text-[#87867f] text-sm">No authors yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {authors.map(author => (
              <div
                key={author.id}
                className="flex gap-3 p-3.5 bg-[#1a1918] border border-[#30302e] rounded-xl hover:border-[#d97757]/40 transition"
              >
                {/* Photo */}
                <div className="w-10 h-14 bg-[#141413] rounded-lg overflow-hidden relative shrink-0 shadow-md">
                  {author.photo_url ? (
                    <Image src={author.photo_url} alt={author.name} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Users className="w-4 h-4 text-[#87867f]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#faf9f5] text-sm truncate">{author.name}</div>
                  {author.nationality && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Globe className="w-2.5 h-2.5 text-[#87867f] shrink-0" />
                      <span className="text-[11px] text-[#87867f] truncate">{author.nationality}</span>
                    </div>
                  )}
                  {author.bio && (
                    <div className="text-[11px] text-[#87867f]/70 mt-1 line-clamp-2 leading-relaxed">
                      {author.bio}
                    </div>
                  )}
                  {author.birth_year && (
                    <div className="text-[10px] text-[#87867f]/50 mt-1">b. {author.birth_year}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
