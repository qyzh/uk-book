import Link from 'next/link'
import Navigation from '@/app/components/Navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-6">
          <div className="text-8xl font-bold text-slate-700">404</div>
          
          <div className="space-y-2">
            <h1 className="font-serif tracking-tight text-2xl font-bold text-slate-300">page not found</h1>
            <p className="text-slate-500">the page you&apos;re looking for doesn&apos;t exist</p>
          </div>

          <div className="border border-slate-700 bg-black bg-opacity-40 p-6 rounded-lg">
            <p className="text-slate-400 text-sm">
              maybe it was moved, deleted, or never existed
            </p>
          </div>

          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-purple-300 transition rounded"
            >
              <span className="text-purple-400">←</span>
              back to library
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 py-8 text-center text-slate-500 text-xs">
        <p>crafted with ♡ • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
