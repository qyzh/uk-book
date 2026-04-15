import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-700 bg-black bg-opacity-90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Home */}
          <Link href="/" className="text-slate-300 text-lg font-bold hover:text-slate-200 transition">
            ➜ bookshelf
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-slate-500 hover:text-slate-400 text-sm transition">
              explore
            </Link>
            <Link href="/admin" className="text-slate-500 hover:text-slate-400 text-xs border border-slate-700 px-3 py-1 transition">
              admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <details className="group">
              <summary className="text-slate-400 hover:text-slate-300 cursor-pointer text-sm font-bold">
                menu
              </summary>
              <div className="absolute right-4 mt-2 w-40 bg-black border border-slate-700 rounded">
                <Link href="/browse" className="block px-4 py-2 text-slate-400 hover:text-slate-300 hover:bg-slate-900 text-sm">
                  explore
                </Link>
                <Link href="/admin" className="block px-4 py-2 text-slate-400 hover:text-slate-300 hover:bg-slate-900 text-sm border-t border-slate-700">
                  admin
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  )
}
