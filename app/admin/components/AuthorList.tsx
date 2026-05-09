'use client'

import Image from 'next/image'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import type { Author } from '@/lib/types/library'
import Button from '@/app/components/Button'

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
        <Button onClick={onNew} size="sm">
          <PixelArtIcon name="Plus" size={16} color="white" /> Add Author
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        {authors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <PixelArtIcon name="Users" size={24} className="text-[#30302e]" />
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
                      <PixelArtIcon name="Users" size={16} className="text-[#87867f]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#faf9f5] text-sm truncate">{author.name}</div>
                  {author.nationality && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <PixelArtIcon name="Globe" size={12} className="text-[#87867f] shrink-0" />
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
