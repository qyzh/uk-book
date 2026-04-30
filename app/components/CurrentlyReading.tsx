'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import Loading from '@/app/components/Loading'
import { useCurrentlyReading } from '@/lib/hooks/useCurrentlyReading'
import { getShortId } from '@/lib/utils/slug'
import { useState } from 'react'

interface CurrentlyReadingProps {
  minimal?: boolean
}

export default function CurrentlyReading({ minimal = false }: CurrentlyReadingProps) {
  const { currentBooks, loading } = useCurrentlyReading()
  const [index, setIndex] = useState(0)

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl h-96 border border-slate-700 flex items-center justify-center">
        <Loading text="booting_reader" />
      </div>
    )
  }

  if (currentBooks.length === 0) return null

  const total = currentBooks.length
  const book = currentBooks[index]
  const prev = () => setIndex(i => (i - 1 + total) % total)
  const next = () => setIndex(i => (i + 1) % total)

  const progressPercent = book.pages && book.current_page
    ? Math.round((book.current_page / book.pages) * 100)
    : 0

  if (minimal) {
    return (
      <div className="relative">
        <Link href={`/books/${getShortId(book.id)}`}>
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] bg-black">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
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
              <div className="absolute top-2 right-2">
                <div className="bg-gradient-to-r from-[#d97757] to-[#e09e72] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  NOW READING
                </div>
              </div>
              {total > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {index + 1}/{total}
                </div>
              )}
            </div>
            <h3 className="font-serif text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-[#d97757] transition">
              {book.title}
            </h3>
            <p className="text-xs text-slate-500 mb-2">{book.authors?.name}</p>
            {book.pages && book.current_page && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Reading Progress</span>
                  <span className="font-mono text-[#d97757]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#d97757] to-[#e09e72] h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            <button onClick={prev} className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1">
              {currentBooks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`rounded-full transition-all ${i === index ? 'w-3 h-1.5 bg-[#d97757]' : 'w-1.5 h-1.5 bg-slate-600 hover:bg-slate-400'}`}
                />
              ))}
            </div>
            <button onClick={next} className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition duration-500">
      {/* Decorative background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d97757]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#d97757]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col-reverse md:flex-row gap-10 md:gap-16 items-center">

        {/* Left Side: Info */}
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                <span className="w-2 h-2 rounded-full bg-[#d97757] animate-pulse shadow-[0_0_10px_#d97757]"></span>
                Currently Reading
                {total > 1 && (
                  <span className="ml-1 text-[#d97757]/70 normal-case tracking-normal font-mono">
                    [{index + 1}/{total}]
                  </span>
                )}
              </div>

              {total > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prev}
                    className="p-1.5 rounded-full border border-slate-700 hover:border-[#d97757]/50 text-slate-400 hover:text-[#d97757] transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {currentBooks.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`rounded-full transition-all ${i === index ? 'w-4 h-1.5 bg-[#d97757]' : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={next}
                    className="p-1.5 rounded-full border border-slate-700 hover:border-[#d97757]/50 text-slate-400 hover:text-[#d97757] transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <Link href={`/books/${getShortId(book.id)}`} className="block">
              <h2 className="font-serif text-5xl md:text-6xl text-slate-100 hover:text-[#d97757] transition-colors tracking-tight leading-tight">
                {book.title}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-lg">
              <span>By <strong className="text-slate-200 font-medium">{book.authors?.name}</strong></span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
              {book.pages ? (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 opacity-70" />
                  {book.pages} pages
                </span>
              ) : null}
              {book.started_at ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 opacity-70" />
                  Started {new Date(book.started_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              ) : null}
            </div>
          </div>

          {book.summary && (
            <p className="text-slate-400 leading-relaxed max-w-2xl text-sm md:text-base line-clamp-4">
              {book.summary}
            </p>
          )}

          {/* Progress Section */}
          <div className="pt-4 max-w-md space-y-5">
            <div className="flex gap-4">
              <Link href={`/books/${getShortId(book.id)}`} className="bg-[#d97757] hover:bg-[#e09e72] text-white font-bold px-8 py-3 rounded shadow-lg transition tracking-widest text-xs flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                VIEW BOOK
              </Link>
            </div>

            {book.pages && book.current_page && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider">
                  <span>PROGRESS</span>
                  <span className="text-[#d97757] text-sm">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#d97757] to-[#e09e72] h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>{book.current_page} of {book.pages} pages read</span>
                  <span>{book.pages - book.current_page} remaining</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Book Cover */}
        <div className="w-[220px] md:w-[320px] shrink-0 mx-auto md:mx-0">
          <Link href={`/books/${getShortId(book.id)}`} className="block group/cover perspective-1000">
            <div className="aspect-[3/4] bg-black relative overflow-hidden rounded-r-[2rem] rounded-l-md border border-slate-700/50 border-l-[8px] border-l-slate-800 shadow-[20px_20px_40px_rgba(0,0,0,0.8),_0_0_20px_rgba(255,255,255,0.02)] group-hover/cover:shadow-[20px_20px_50px_rgba(0,0,0,0.9),_0_0_30px_rgba(168,85,247,0.15)] group-hover/cover:-translate-y-2 transition-all duration-500 ease-out preserve-3d group-hover/cover:rotate-y-[-5deg]">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
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
