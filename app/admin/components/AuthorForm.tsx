'use client'

import { useState } from 'react'

export interface AuthorFormData {
  name: string
  bio: string
  nationality: string
  birth_year: number
  photo_url: string
}

export const EMPTY_AUTHOR_FORM: AuthorFormData = {
  name: '',
  bio: '',
  nationality: '',
  birth_year: new Date().getFullYear(),
  photo_url: '',
}

interface AuthorFormProps {
  formId: string
  data: AuthorFormData
  onChange: (data: AuthorFormData) => void
  onSubmit: (data: AuthorFormData, photoFile: File | null) => void
}

export default function AuthorForm({ formId, data, onChange, onSubmit }: AuthorFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>(data.photo_url)
  const set = (patch: Partial<AuthorFormData>) => onChange({ ...data, ...patch })
  const inputClass = "w-full px-3 py-2 bg-[#1a1918] border border-[#30302e] text-[#faf9f5] text-sm rounded focus:border-[#d97757] outline-none"
  const labelClass = "text-[#87867f] text-xs font-bold block mb-1"

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <form
      id={formId}
      onSubmit={e => { e.preventDefault(); onSubmit(data, photoFile) }}
      className="space-y-4"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      <div>
        <label className={labelClass}>name *</label>
        <input type="text" required value={data.name} onChange={e => set({ name: e.target.value })} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>nationality</label>
          <input type="text" value={data.nationality} onChange={e => set({ nationality: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>birth year</label>
          <input type="number" value={data.birth_year} onChange={e => set({ birth_year: parseInt(e.target.value) || 0 })} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full text-xs text-[#87867f] file:mr-3 file:py-1 file:px-3 file:bg-[#d97757] file:border-0 file:text-white file:rounded file:cursor-pointer file:text-xs"
        />
        <input
          type="url"
          value={data.photo_url}
          onChange={e => { set({ photo_url: e.target.value }); if (e.target.value) setPhotoPreview(e.target.value) }}
          placeholder="or paste image URL..."
          className={`${inputClass} mt-2`}
        />
        {(photoPreview || data.photo_url) && (
          <div className="mt-2 w-12 h-16 relative overflow-hidden rounded bg-[#1a1918]">
            <img src={photoPreview || data.photo_url} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div>
        <label className={labelClass}>bio</label>
        <textarea value={data.bio} onChange={e => set({ bio: e.target.value })} rows={4} className={`${inputClass} resize-y`} />
      </div>
    </form>
  )
}
