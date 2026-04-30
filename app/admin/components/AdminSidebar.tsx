'use client'

import { Library, Quote, NotebookPen, Users, LogOut } from 'lucide-react'

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

const NAV_ITEMS: { id: AdminSection; label: string; Icon: React.ElementType }[] = [
  { id: 'books',   label: 'Books',   Icon: Library },
  { id: 'quotes',  label: 'Quotes',  Icon: Quote },
  { id: 'notes',   label: 'Notes',   Icon: NotebookPen },
  { id: 'authors', label: 'Authors', Icon: Users },
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
      className="hidden lg:flex flex-col w-[200px] shrink-0 border-r border-[#30302e] bg-[#141413] h-full"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      {/* Nav items */}
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm transition
                border-l-4
                ${isActive
                  ? 'border-l-[#d97757] bg-[#1f1e1d] text-[#faf9f5]'
                  : 'border-l-transparent text-[#87867f] hover:text-[#faf9f5] hover:bg-[#1f1e1d]/60'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              <span className="text-xs opacity-50">{counts[id]}</span>
            </button>
          )
        })}
      </nav>

      {/* Stats */}
      <div className="px-4 py-3 border-t border-[#30302e] space-y-1">
        <div className="flex justify-between text-xs text-[#87867f]">
          <span>total</span><span>{stats.total}</span>
        </div>
        <div className="flex justify-between text-xs text-[#87867f]">
          <span>reading</span><span>{stats.reading}</span>
        </div>
        <div className="flex justify-between text-xs text-[#87867f]">
          <span>done</span><span>{stats.completed}</span>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-3 border-t border-[#30302e]">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-[#87867f] hover:text-red-400 transition w-full"
        >
          <LogOut className="w-3.5 h-3.5" />
          logout
        </button>
      </div>
    </aside>
  )
}
