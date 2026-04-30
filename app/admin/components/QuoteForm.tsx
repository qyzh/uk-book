'use client'

import type { Book } from '@/lib/types/library'

export interface QuoteFormData {
  book_id: string
  text: string
  page_number: string
  is_favorite: boolean
}

export const EMPTY_QUOTE_FORM: QuoteFormData = {
  book_id: '',
  text: '',
  page_number: '',
  is_favorite: false,
}

interface QuoteFormProps {
  formId: string
  data: QuoteFormData
  books: Book[]
  onChange: (data: QuoteFormData) => void
  onSubmit: (data: QuoteFormData) => void
}

export default function QuoteForm({ formId, data, books, onChange, onSubmit }: QuoteFormProps) {
  const set = (patch: Partial<QuoteFormData>) => onChange({ ...data, ...patch })
  const inputClass = "w-full px-3 py-2 bg-[#1a1918] border border-[#30302e] text-[#faf9f5] text-sm rounded focus:border-[#d97757] outline-none"
  const labelClass = "text-[#87867f] text-xs font-bold block mb-1"

  return (
    <form
      id={formId}
      onSubmit={e => { e.preventDefault(); onSubmit(data) }}
      className="space-y-4"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      <div>
        <label className={labelClass}>book *</label>
        <select required value={data.book_id} onChange={e => set({ book_id: e.target.value })} className={inputClass}>
          <option value="">select book...</option>
          {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>page</label>
        <input type="number" value={data.page_number} onChange={e => set({ page_number: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>quote *</label>
        <textarea required value={data.text} onChange={e => set({ text: e.target.value })} rows={5} placeholder="the quote..." className={`${inputClass} resize-y`} />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_favorite"
          checked={data.is_favorite}
          onChange={e => set({ is_favorite: e.target.checked })}
          className="w-4 h-4 accent-[#d97757]"
        />
        <label htmlFor="is_favorite" className="text-[#87867f] text-sm">mark as favorite</label>
      </div>
    </form>
  )
}
