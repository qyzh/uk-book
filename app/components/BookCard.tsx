import Image from 'next/image'
import Link from 'next/link'
import type { Book } from '@/lib/types/library'
import { getShortId } from '@/lib/utils/slug'

interface BookCardProps {
  book: Book
}

function getStatusStyles(status: string) {
  if (status === 'completed') return 'bg-emerald-900 text-emerald-300'
  if (status === 'reading') return 'bg-purple-900 text-purple-300'
  if (status === 'wishlist') return 'bg-blue-900 text-blue-300'
  return 'bg-slate-800 text-slate-300'
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${getShortId(book.id)}`}
      className="group border border-slate-700 hover:border-purple-600 transition overflow-hidden hover:shadow-lg hover:shadow-purple-500/20"
    >
      <div className="aspect-[3/4] bg-slate-900 relative overflow-hidden">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
            <div className="text-center px-4">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-slate-500 text-xs text-center line-clamp-2">{book.title}</div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-black">
        <h3 className="font-bold text-slate-200 line-clamp-2 mb-1 group-hover:text-purple-300 transition">
          {book.title}
        </h3>
        <p className="text-slate-500 text-sm mb-2 line-clamp-1">{book.authors?.name}</p>

        {book.summary && <p className="text-slate-600 text-xs mb-3 line-clamp-2">{book.summary}</p>}

        <div className="mb-2 inline-block">
          <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusStyles(book.reading_status)}`}>
            {book.reading_status}
          </span>
        </div>

        <div className="space-y-1 text-xs text-slate-600 mb-3">
          {book.started_at && <div>started: {new Date(book.started_at).toLocaleDateString('en-GB')}</div>}
          {book.finished_at && <div>finished: {new Date(book.finished_at).toLocaleDateString('en-GB')}</div>}
          {book.reading_status === 'reading' && book.current_page && book.pages && (
            <div className="space-y-1">
              <div>
                page {book.current_page} of {book.pages}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full"
                  style={{ width: `${(book.current_page / book.pages) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-800">
          <span>{book.published_year || '—'}</span>
          <span>{book.sub_genre || book.genre || 'unknown'}</span>
        </div>
      </div>
    </Link>
  )
}
