'use client'

import { useState } from 'react'
import Link from 'next/link'

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke="#d97757"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      stroke="#d97757"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BurgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const navLinks = [
  { href: '/browse', label: 'explore' },
  { href: '/wishlist', label: 'wishlist' },
  { href: '/quotes', label: 'quotes' },
  { href: '/admin', label: 'admin' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[#30302e] bg-[#141413]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-12 py-6 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => setOpen(false)}
          >
            <span className="flex items-center leading-none">
              <BookIcon />
            </span>
            <span className="font-serif text-[#faf9f5] text-xl font-semibold leading-none group-hover:text-white transition">
              UKbook
            </span>
          </Link>


          {/* Hamburger – always visible, desktop links hidden on mobile */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="text-[#87867f] hover:text-[#faf9f5] transition-colors duration-200 cursor-pointer md:hidden"
          >
            {open ? <CloseIcon /> : <BurgerIcon />}
          </button>

          {/* Desktop hamburger (right-side, always shown on ≥md to match Claude nav) */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="text-[#87867f] hover:text-[#faf9f5] transition-colors duration-200 cursor-pointer hidden md:block"
          >
            {open ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </div>
      </nav>

      {/* Full-screen drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#141413]/95 backdrop-blur-sm flex flex-col"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-7xl mx-auto w-full px-12 pt-20 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-4xl sm:text-5xl font-semibold text-[#faf9f5]/80 hover:text-[#faf9f5] tracking-tight py-3 border-b border-[#30302e] transition-colors duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
