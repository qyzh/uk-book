'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

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
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed lg:relative inset-y-0 right-0 z-40 lg:z-auto
          w-[380px] max-w-full flex flex-col
          bg-[#141413] border-l border-[#30302e]
          transition-transform duration-200
          ${open ? 'translate-x-0' : 'translate-x-full lg:hidden'}
        `}
        style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#30302e] shrink-0">
          <h2 className="text-sm font-bold text-[#faf9f5]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#87867f] hover:text-[#faf9f5] hover:bg-[#1f1e1d] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Sticky footer */}
        {(onSave || onDelete) && (
          <div className="flex items-center gap-2 px-4 py-3 border-t border-[#30302e] shrink-0">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="p-2 rounded border border-red-800 text-red-400 hover:bg-red-900/30 transition"
                title="delete"
              >
                <span className="text-xs">delete</span>
              </button>
            )}
            {onSave && (
              <button
                type="submit"
                form="detail-form"
                disabled={saving}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#d97757] hover:bg-[#e09e72] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded transition"
              >
                {saving ? 'saving...' : 'save'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
