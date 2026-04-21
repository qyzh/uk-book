'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Clock } from 'lucide-react'
import Loading from '@/app/components/Loading'
import { useCurrentlyReading } from '@/lib/hooks/useCurrentlyReading'
import { getShortId } from '@/lib/utils/slug'

interface CurrentlyReadingProps {
  minimal?: boolean
}

export default function CurrentlyReading({ minimal = false }: CurrentlyReadingProps) {
  const { currentBook, loading } = useCurrentlyReading()

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl h-96 border border-slate-700 flex items-center justify-center">
        <Loading text="booting_reader" />
      </div>
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
      <Link href={`/books/${getShortId(currentBook.id)}`}>
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] bg-black">
            {currentBook.cover_url ? (
              <Image
                src={currentBook.cover_url}
                alt={currentBook.title}
                fill
                sizes="200px"
                loading="eager"
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition duration-500">
      {/* Decorative background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col-reverse md:flex-row gap-10 md:gap-16 items-center">

        {/* Left Side: Info */}
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]"></span>
              Currently Reading
            </div>

            <Link href={`/books/${getShortId(currentBook.id)}`} className="block">
              <h2 className="font-serif text-5xl md:text-6xl text-slate-100 hover:text-purple-300 transition-colors tracking-tight leading-tight">
                {currentBook.title}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-lg">
              <span>By <strong className="text-slate-200 font-medium">{currentBook.authors?.name}</strong></span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
              {currentBook.pages ? (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 opacity-70" />
                  {currentBook.pages} pages
                </span>
              ) : null}
              {currentBook.started_at ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 opacity-70" />
                  Started {new Date(currentBook.started_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              ) : null}
            </div>
          </div>

          {currentBook.summary && (
            <p className="text-slate-400 leading-relaxed max-w-2xl text-sm md:text-base line-clamp-4">
              {currentBook.summary}
            </p>
          )}

          {/* Progress Section */}
          <div className="pt-4 max-w-md space-y-5">
            <div className="flex gap-4">
              <Link href={`/books/${getShortId(currentBook.id)}`} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded shadow-lg transition tracking-widest text-xs flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                VIEW BOOK
              </Link>
            </div>

            {currentBook.pages && currentBook.current_page && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider">
                  <span>PROGRESS</span>
                  <span className="text-purple-400 text-sm">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>{currentBook.current_page} of {currentBook.pages} pages read</span>
                  <span>{currentBook.pages - currentBook.current_page} remaining</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Book Cover */}
        <div className="w-[220px] md:w-[320px] shrink-0 mx-auto md:mx-0">
          <Link href={`/books/${getShortId(currentBook.id)}`} className="block group/cover perspective-1000">
            <div className="aspect-[3/4] bg-black relative overflow-hidden rounded-r-[2rem] rounded-l-md border border-slate-700/50 border-l-[8px] border-l-slate-800 shadow-[20px_20px_40px_rgba(0,0,0,0.8),_0_0_20px_rgba(255,255,255,0.02)] group-hover/cover:shadow-[20px_20px_50px_rgba(0,0,0,0.9),_0_0_30px_rgba(168,85,247,0.15)] group-hover/cover:-translate-y-2 transition-all duration-500 ease-out preserve-3d group-hover/cover:rotate-y-[-5deg]">
              {currentBook.cover_url ? (
                <Image
                  src={currentBook.cover_url}
                  alt={currentBook.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  loading="eager"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                  <span className="text-6xl text-slate-600">📖</span>
                </div>
              )}
              {/* Premium Realistic Lighting overlays */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/60 via-white/10 to-transparent pointer-events-none mix-blend-overlay z-10"></div>
              <div className="absolute inset-y-0 left-0 w-[1px] bg-white/30 pointer-events-none mix-blend-overlay z-10"></div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-r-[2rem] rounded-l-md pointer-events-none z-10"></div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
