'use client'

import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import type * as PixelIcons from 'pixelarticons/react'

export type AdminSection = 'books' | 'quotes' | 'notes' | 'authors'

interface SidebarStats {
  total: number
  reading: number
  completed: number
}

interface AdminSidebarProps {
  active: AdminSection
  counts: Record<AdminSection, number>
  stats: SidebarStats
  onSelect: (section: AdminSection) => void
  onLogout: () => void
}

const NAV_ITEMS: { id: AdminSection; label: string; icon: keyof typeof PixelIcons }[] = [
  { id: 'books',   label: 'Books',   icon: 'Library' },
  { id: 'quotes',  label: 'Quotes',  icon: 'QuoteTextInline' },
  { id: 'notes',   label: 'Notes',   icon: 'Notebook' },
  { id: 'authors', label: 'Authors', icon: 'Users' },
]

export default function AdminSidebar({
  active,
  counts,
  stats,
  onSelect,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-[#30302e] bg-[#0f0e0d] h-full"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#30302e]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#d97757] flex items-center justify-center shrink-0">
            <PixelArtIcon name="Bookmark" size={16} color="white" />
          </div>
          <div>
            <div className="text-[#faf9f5] text-sm font-bold leading-none">ukbook</div>
            <div className="text-[#87867f] text-[10px] mt-0.5">admin panel</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2">
        <div className="text-[10px] font-bold text-[#87867f] uppercase tracking-widest px-3 mb-2">
          Content
        </div>
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg mb-0.5 transition-all
                ${isActive
                  ? 'bg-[#d97757]/15 text-[#d97757] font-bold'
                  : 'text-[#87867f] hover:text-[#faf9f5] hover:bg-[#1f1e1d]'}
              `}
            >
              <PixelArtIcon 
                name={icon}
                size={16}
                className={isActive ? 'text-[#d97757]' : ''}
              />
              <span className="flex-1 text-left">{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isActive
                    ? 'bg-[#d97757]/20 text-[#d97757]'
                    : 'bg-[#1f1e1d] text-[#87867f]'
                }`}
              >
                {counts[id]}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Stats */}
      <div className="px-4 py-4 border-t border-[#30302e] mx-2 mb-2 bg-[#1a1918] rounded-xl">
        <div className="text-[10px] font-bold text-[#87867f] uppercase tracking-widest mb-3">
          Library Stats
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#87867f]">Total books</span>
            <span className="text-xs font-bold text-[#faf9f5]">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span className="text-xs text-[#87867f]">Reading</span>
            </div>
            <span className="text-xs font-bold text-yellow-400">{stats.reading}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-xs text-[#87867f]">Completed</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">{stats.completed}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 pt-2 border-t border-[#30302e]">
            <div className="flex justify-between text-[10px] text-[#87867f] mb-1">
              <span>completion rate</span>
              <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
            </div>
            <div className="h-1 bg-[#30302e] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-[#87867f] hover:text-red-400 transition w-full px-3 py-2 rounded-lg hover:bg-red-950/30"
        >
          <PixelArtIcon name="Logout" size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
