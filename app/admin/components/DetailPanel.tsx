'use client'

import { useEffect } from 'react'
import { X, Trash2, Save } from 'lucide-react'

interface DetailPanelProps {
  open: boolean
  title: string
  onClose: () => void
  onSave?: () => void
  onDelete?: () => void
  saving?: boolean
  children: React.ReactNode
}

export default function DetailPanel({
  open,
  title,
  onClose,
  onSave,
  onDelete,
  saving,
  children,
}: DetailPanelProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed lg:relative inset-y-0 right-0 z-40 lg:z-auto
          w-[400px] max-w-full flex flex-col
          bg-[#0f0e0d] border-l border-[#30302e]
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full lg:hidden'}
        `}
        style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30302e] shrink-0 bg-[#0f0e0d]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#d97757] rounded-full shrink-0" />
            <h2 className="text-sm font-bold text-[#faf9f5] tracking-wide">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#87867f] hover:text-[#faf9f5] hover:bg-[#1f1e1d] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Sticky footer */}
        {(onSave || onDelete) && (
          <div className="flex items-center gap-2 px-5 py-4 border-t border-[#30302e] shrink-0 bg-[#0f0e0d]">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-900/60 text-red-400 hover:bg-red-950/40 hover:border-red-700 transition text-xs font-bold"
                title="delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
            {onSave && (
              <button
                type="submit"
                form="detail-form"
                disabled={saving}
                className="ml-auto flex items-center gap-2 px-5 py-2 bg-[#d97757] hover:bg-[#e09e72] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition shadow-lg shadow-[#d97757]/20"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
