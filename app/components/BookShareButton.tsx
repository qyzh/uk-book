'use client'

import { useState } from 'react'
import type { Book } from '@/lib/types/library'

interface BookShareButtonProps {
  book: Book
  status?: 'to-read' | 'reading' | 'completed' | 'wishlist'
}

export default function BookShareButton({ book, status = 'to-read' }: BookShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    setIsLoading(true)
    try {
      const { generateBookImage, downloadImage } = await import('@/lib/utils/quote-image')
      const blob = await generateBookImage({
        title: book.title,
        author: book.authors?.name,
        coverUrl: book.cover_url || undefined,
        status,
      })

      const timestamp = new Date().getTime()
      downloadImage(blob, `book-${timestamp}.png`)
    } catch (error) {
      console.error('Failed to generate book image:', error)
      alert('Failed to generate share image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded border border-slate-600 text-slate-300 hover:border-purple-500 hover:text-purple-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download book as Instagram Story image"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="18" cy="5" r="3"></circle>
        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9m0 0a9 9 0 0 0-9 9"></path>
      </svg>
      {isLoading ? 'Creating...' : 'Share'}
    </button>
  )
}
