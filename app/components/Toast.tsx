'use client'

import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import { useToast, Toast as ToastType } from '@/lib/hooks/useToast'
import type * as PixelIcons from 'pixelarticons/react'

const icons: Record<ToastType['type'], keyof typeof PixelIcons> = {
  success: 'Check',
  error: 'Delete',
  warning: 'SquareAlert',
  info: 'InfoBox',
}

const iconColors = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-[#d97757]',
}

const borderColors = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-[#d97757]',
}

function ToastItem({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
  const iconName = icons[toast.type]
  const iconColor = iconColors[toast.type]

  return (
    <div
      className={`flex items-start gap-3 bg-black border border-slate-700 border-l-4 ${borderColors[toast.type]} rounded-lg shadow-lg p-4 min-w-[320px] max-w-md animate-slide-in`}
    >
      <div className={`flex-shrink-0 ${iconColor}`}>
        <PixelArtIcon name={iconName} size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-slate-400 mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-500 hover:text-white transition-colors"
      >
        <PixelArtIcon name="Delete" size={16} />
      </button>
    </div>
  )
}

export default function Toast() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}
