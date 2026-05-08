'use client'

import { useState } from 'react'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
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
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded border ukborder text-slate-300 hover:border-[#d97757] hover:text-[#d97757] transition disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download book as Instagram Story image"
    >
      <PixelArtIcon name="Upload" size={16} />
      {isLoading ? 'Creating...' : 'Share'}
    </button>
  )
}
