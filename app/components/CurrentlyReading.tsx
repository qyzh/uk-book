'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCurrentlyReading } from '@/lib/hooks/useCurrentlyReading'

interface CurrentlyReadingProps {
  minimal?: boolean
}

export default function CurrentlyReading({ minimal = false }: CurrentlyReadingProps) {
  const { currentBook, loading } = useCurrentlyReading()

  if (loading) {
    return (
      <div className="animate-pulse bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl h-96 border border-slate-700" />
    )
  }

  if (!currentBook) {
    return null
  }

  const progressPercent = currentBook.pages && currentBook.current_page 
    ? Math.round((currentBook.current_page / currentBook.pages) * 100)
    : 0

  if (minimal) {
    return (
      <Link href={`/books/${currentBook.id}`}>
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] bg-slate-900">
            {currentBook.cover_url ? (
              <Image
                src={currentBook.cover_url}
                alt={currentBook.title}
                fill
                sizes="200px"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <span className="text-4xl">📖</span>
              </div>
            )}
            {/* "Now Reading" Badge */}
            <div className="absolute top-2 right-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                NOW READING
              </div>
            </div>
          </div>
          <h3 className="font-serif text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-purple-300 transition">
            {currentBook.title}
          </h3>
          <p className="text-xs text-slate-500 mb-2">{currentBook.authors?.name}</p>
          {currentBook.pages && currentBook.current_page && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Reading Progress</span>
                <span className="font-mono text-purple-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl hover:border-purple-400/50 transition duration-500">
      {/* Decorative background elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Badge & Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-bold text-purple-300">
              Currently Reading
            </span>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg animate-pulse">
            IN PROGRESS
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-6">
          {/* Book Cover */}
          <Link href={`/books/${currentBook.id}`} className="group/cover">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-purple-500/30 group-hover/cover:ring-purple-400/60 transition">
              {currentBook.cover_url ? (
                <Image
                  src={currentBook.cover_url}
                  alt={currentBook.title}
                  fill
                  sizes="200px"
                  className="object-cover group-hover/cover:scale-110 transition duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                  <span className="text-6xl">📖</span>
                </div>
              )}
            </div>
          </Link>

          {/* Book Info & Quote */}
          <div className="flex flex-col justify-between space-y-4">
            {/* Title & Author */}
            <div>
              <Link href={`/books/${currentBook.id}`} className="group/title">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-100 mb-2 group-hover/title:text-transparent group-hover/title:bg-gradient-to-r group-hover/title:from-purple-400 group-hover/title:to-pink-400 group-hover/title:bg-clip-text transition leading-tight">
                  {currentBook.title}
                </h2>
              </Link>
              <p className="text-slate-400 text-lg">{currentBook.authors?.name}</p>
            </div>

            {/* Progress Section - Below Title */}
            {currentBook.pages && currentBook.current_page && (
              <div className="space-y-3 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-purple-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Reading Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      {progressPercent}%
                    </span>
                    <span className="text-xs text-slate-500">
                      {currentBook.current_page}/{currentBook.pages}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 h-full rounded-full shadow-lg shadow-purple-500/50 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 text-center">
                  {currentBook.pages - (currentBook.current_page || 0)} pages remaining
                </div>
              </div>
            )}
          </div>
        </div>

        {/* End of content */}
      </div>
    </div>
  )
}
