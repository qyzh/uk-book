'use client'

import type { Book } from '@/lib/types/library'

export interface NoteFormData {
  book_id: string
  content: string
  note_type: string
}

export const EMPTY_NOTE_FORM: NoteFormData = {
  book_id: '',
  content: '',
  note_type: 'general',
}

interface NoteFormProps {
  formId: string
  data: NoteFormData
  books: Book[]
  onChange: (data: NoteFormData) => void
  onSubmit: (data: NoteFormData) => void
}

export default function NoteForm({ formId, data, books, onChange, onSubmit }: NoteFormProps) {
  const set = (patch: Partial<NoteFormData>) => onChange({ ...data, ...patch })
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
        <label className={labelClass}>type</label>
        <select value={data.note_type} onChange={e => set({ note_type: e.target.value })} className={inputClass}>
          <option value="general">general</option>
          <option value="summary">summary</option>
          <option value="analysis">analysis</option>
          <option value="idea">idea</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>note *</label>
        <textarea required value={data.content} onChange={e => set({ content: e.target.value })} rows={8} placeholder="your notes..." className={`${inputClass} resize-y`} />
      </div>
    </form>
  )
}
