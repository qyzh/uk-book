'use client'

import { useEffect, useState } from 'react'
import { Tag as TagIcon, X } from 'lucide-react'
import type { Book, Tag } from '@/lib/types/library'
import { fetchTags } from '@/lib/api/quotes'

export interface QuoteFormData {
  book_id: string
  text: string
  page_number: string
  is_favorite: boolean
  tag_ids: string[]
}

export const EMPTY_QUOTE_FORM: QuoteFormData = {
  book_id: '',
  text: '',
  page_number: '',
  is_favorite: false,
  tag_ids: [],
}

interface QuoteFormProps {
  formId: string
  data: QuoteFormData
  books: Book[]
  mode?: 'new' | 'edit'
  onChange: (data: QuoteFormData) => void
  onSubmit: (data: QuoteFormData) => void
}

// Colour map for tag pill backgrounds — matches the TagColor type
const TAG_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  gray:   { bg: 'bg-slate-700/60',   text: 'text-slate-300',  ring: 'ring-slate-500' },
  blue:   { bg: 'bg-blue-900/50',    text: 'text-blue-300',   ring: 'ring-blue-500' },
  green:  { bg: 'bg-emerald-900/50', text: 'text-emerald-300',ring: 'ring-emerald-500' },
  yellow: { bg: 'bg-yellow-900/50',  text: 'text-yellow-300', ring: 'ring-yellow-500' },
  red:    { bg: 'bg-red-900/50',     text: 'text-red-300',    ring: 'ring-red-500' },
  purple: { bg: 'bg-purple-900/50',  text: 'text-purple-300', ring: 'ring-purple-500' },
  orange: { bg: 'bg-[#d97757]/20',   text: 'text-[#d97757]',  ring: 'ring-[#d97757]' },
  pink:   { bg: 'bg-pink-900/50',    text: 'text-pink-300',   ring: 'ring-pink-500' },
}

function tagColors(color: string) {
  return TAG_COLORS[color] ?? TAG_COLORS.gray
}

export default function QuoteForm({ formId, data, books, mode = 'new', onChange, onSubmit }: QuoteFormProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [loadingTags, setLoadingTags] = useState(true)

  const set = (patch: Partial<QuoteFormData>) => onChange({ ...data, ...patch })

  const inputClass =
    'w-full px-3 py-2 bg-[#1a1918] border border-[#30302e] text-[#faf9f5] text-sm rounded focus:border-[#d97757] outline-none transition'
  const labelClass = 'text-[#87867f] text-xs font-bold block mb-1'

  // Load tags once
  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => {/* silent */})
      .finally(() => setLoadingTags(false))
  }, [])

  // Toggle a tag id in or out of the selection
  const toggleTag = (tagId: string) => {
    const current = data.tag_ids ?? []
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId]
    set({ tag_ids: next })
  }

  const selectedTagIds = new Set(data.tag_ids ?? [])

  return (
    <form
      id={formId}
      onSubmit={(e) => { e.preventDefault(); onSubmit(data) }}
      className="space-y-4"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      {/* Book selector */}
      <div>
        <label className={labelClass}>
          book {mode === 'new' ? '*' : <span className="font-normal text-[#87867f]/60">(locked)</span>}
        </label>
        <select
          required
          value={data.book_id}
          onChange={(e) => set({ book_id: e.target.value })}
          disabled={mode === 'edit'}
          className={`${inputClass} ${mode === 'edit' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="">select book...</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
      </div>

      {/* Page number */}
      <div>
        <label className={labelClass}>page</label>
        <input
          type="number"
          value={data.page_number}
          onChange={(e) => set({ page_number: e.target.value })}
          className={inputClass}
          placeholder="optional"
        />
      </div>

      {/* Quote text */}
      <div>
        <label className={labelClass}>quote *</label>
        <textarea
          required
          value={data.text}
          onChange={(e) => set({ text: e.target.value })}
          rows={5}
          placeholder="the quote..."
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Tag picker */}
      <div>
        <label className={labelClass}>
          <span className="inline-flex items-center gap-1.5">
            <TagIcon className="w-3 h-3" />
            tags
            <span className="text-[#87867f] font-normal">(pick one or more)</span>
          </span>
        </label>

        {loadingTags ? (
          <div className="text-xs text-[#87867f] animate-pulse py-2">loading tags…</div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {availableTags.map((tag) => {
              const selected = selectedTagIds.has(tag.id)
              const c = tagColors(tag.color)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition',
                    c.bg, c.text,
                    selected
                      ? `ring-1 ${c.ring} opacity-100`
                      : 'opacity-50 hover:opacity-80',
                  ].join(' ')}
                >
                  {tag.name}
                  {selected && <X className="w-2.5 h-2.5 shrink-0" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Selected summary */}
        {(data.tag_ids ?? []).length > 0 && (
          <p className="text-[11px] text-[#87867f] mt-2">
            {(data.tag_ids ?? []).length} tag{(data.tag_ids ?? []).length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Favorite checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="is_favorite"
          checked={data.is_favorite}
          onChange={(e) => set({ is_favorite: e.target.checked })}
          className="w-4 h-4 accent-[#d97757]"
        />
        <label htmlFor="is_favorite" className="text-[#87867f] text-sm">
          mark as favorite
        </label>
      </div>
    </form>
  )
}
