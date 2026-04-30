'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { GENRES, SUB_GENRES } from '@/lib/constants/library'
import type { Author, Book } from '@/lib/types/library'

export interface BookFormData {
  title: string
  author_id: string
  isbn: string
  cover_url: string
  published_year: number
  pages: string
  publisher: string
  summary: string
  reading_status: string
  language: string
  genre: string
  sub_genres: string[]
  started_at: string
  finished_at: string
  current_page: string
}

export const EMPTY_BOOK_FORM: BookFormData = {
  title: '',
  author_id: '',
  isbn: '',
  cover_url: '',
  published_year: new Date().getFullYear(),
  pages: '',
  publisher: '',
  summary: '',
  reading_status: 'to-read',
  language: 'id',
  genre: 'fiction',
  sub_genres: [],
  started_at: '',
  finished_at: '',
  current_page: '',
}

export function bookToFormData(book: Book): BookFormData {
  return {
    title: book.title,
    author_id: book.authors?.id ?? '',
    isbn: book.isbn ?? '',
    cover_url: book.cover_url ?? '',
    published_year: book.published_year ?? new Date().getFullYear(),
    pages: book.pages?.toString() ?? '',
    publisher: book.publisher ?? '',
    summary: book.summary ?? '',
    reading_status: book.reading_status ?? 'to-read',
    language: book.language ?? 'id',
    genre: book.genre ?? 'fiction',
    sub_genres: book.sub_genre ? book.sub_genre.split(',').map(s => s.trim()).filter(Boolean) : [],
    started_at: book.started_at ?? '',
    finished_at: book.finished_at ?? '',
    current_page: book.current_page?.toString() ?? '',
  }
}

interface BookFormProps {
  formId: string
  data: BookFormData
  authors: Author[]
  onChange: (data: BookFormData) => void
  onSubmit: (data: BookFormData, coverFile: File | null) => void
}

export default function BookForm({ formId, data, authors, onChange, onSubmit }: BookFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>(data.cover_url)
  const [newSubGenre, setNewSubGenre] = useState('')

  const set = (patch: Partial<BookFormData>) => onChange({ ...data, ...patch })

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const addSubGenre = (value: string) => {
    const trimmed = value.trim()
    if (trimmed && !data.sub_genres.includes(trimmed)) {
      set({ sub_genres: [...data.sub_genres, trimmed] })
    }
  }

  const removeSubGenre = (i: number) => {
    set({ sub_genres: data.sub_genres.filter((_, idx) => idx !== i) })
  }

  const inputClass = "w-full px-3 py-2 bg-[#1a1918] border border-[#30302e] text-[#faf9f5] text-sm rounded focus:border-[#d97757] outline-none"
  const labelClass = "text-[#87867f] text-xs font-bold block mb-1"
  const groupClass = "border border-[#30302e] rounded-lg p-3 space-y-3"
  const groupTitleClass = "text-xs font-bold text-[#87867f] uppercase tracking-wider mb-2"

  return (
    <form
      id={formId}
      onSubmit={e => { e.preventDefault(); onSubmit(data, coverFile) }}
      className="space-y-4"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      {/* Identity */}
      <div className={groupClass}>
        <div className={groupTitleClass}>identity</div>
        <div>
          <label className={labelClass}>title *</label>
          <input type="text" required value={data.title} onChange={e => set({ title: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>author *</label>
          <select required value={data.author_id} onChange={e => set({ author_id: e.target.value })} className={inputClass}>
            <option value="">select author...</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>isbn</label>
            <input type="text" value={data.isbn} onChange={e => set({ isbn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>year</label>
            <input type="number" value={data.published_year} onChange={e => set({ published_year: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Reading */}
      <div className={groupClass}>
        <div className={groupTitleClass}>reading</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>status</label>
            <select value={data.reading_status} onChange={e => set({ reading_status: e.target.value })} className={inputClass}>
              <option value="to-read">to-read</option>
              <option value="reading">reading</option>
              <option value="completed">completed</option>
              <option value="wishlist">wishlist</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>current page</label>
            <input
              type="number"
              value={data.current_page}
              onChange={e => set({ current_page: e.target.value })}
              disabled={data.reading_status === 'to-read' || data.reading_status === 'wishlist'}
              className={`${inputClass} disabled:opacity-40`}
            />
          </div>
        </div>
        {(data.reading_status === 'reading' || data.reading_status === 'completed') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>started</label>
              <input type="date" value={data.started_at} onChange={e => set({ started_at: e.target.value })} className={inputClass} />
            </div>
            {data.reading_status === 'completed' && (
              <div>
                <label className={labelClass}>finished</label>
                <input type="date" value={data.finished_at} onChange={e => set({ finished_at: e.target.value })} className={inputClass} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={groupClass}>
        <div className={groupTitleClass}>details</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>genre</label>
            <select value={data.genre} onChange={e => set({ genre: e.target.value })} className={inputClass}>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>language</label>
            <select value={data.language} onChange={e => set({ language: e.target.value })} className={inputClass}>
              <option value="id">id</option>
              <option value="en">en</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>pages</label>
            <input type="number" value={data.pages} onChange={e => set({ pages: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>publisher</label>
            <input type="text" value={data.publisher} onChange={e => set({ publisher: e.target.value })} className={inputClass} />
          </div>
        </div>
        {/* Sub-genres */}
        <div>
          <label className={labelClass}>sub-genres</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {data.sub_genres.map((sg, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#d97757]/20 border border-[#d97757]/40 text-[#d97757] text-xs rounded">
                {sg}
                <button type="button" onClick={() => removeSubGenre(i)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <select
            value=""
            onChange={e => { if (e.target.value) addSubGenre(e.target.value) }}
            className={inputClass}
          >
            <option value="">+ add sub-genre...</option>
            {SUB_GENRES.filter(sg => !data.sub_genres.includes(sg)).map(sg => (
              <option key={sg} value={sg}>{sg}</option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newSubGenre}
              onChange={e => setNewSubGenre(e.target.value)}
              placeholder="custom sub-genre..."
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => { addSubGenre(newSubGenre); setNewSubGenre('') }}
              className="px-3 py-2 bg-[#1f1e1d] border border-[#30302e] text-[#faf9f5] text-xs rounded hover:border-[#d97757] transition"
            >
              add
            </button>
          </div>
        </div>
      </div>

      {/* Cover */}
      <div className={groupClass}>
        <div className={groupTitleClass}>cover</div>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="w-full text-xs text-[#87867f] file:mr-3 file:py-1 file:px-3 file:bg-[#d97757] file:border-0 file:text-white file:rounded file:cursor-pointer file:text-xs"
        />
        {coverPreview && (
          <div className="mt-2 w-16 h-24 relative overflow-hidden rounded bg-[#1a1918]">
            <img src={coverPreview} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Summary */}
      <div className={groupClass}>
        <div className={groupTitleClass}>summary</div>
        <textarea
          value={data.summary}
          onChange={e => set({ summary: e.target.value })}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </div>
    </form>
  )
}
