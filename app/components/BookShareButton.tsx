'use client'

import { useState } from 'react'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import type { Book } from '@/lib/types/library'
import Button from '@/app/components/Button'

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
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={isLoading}
      loading={isLoading}
      title="Download book as Instagram Story image"
    >
      <PixelArtIcon name="Upload" size={16} />
      {isLoading ? 'Creating...' : 'Share'}
    </Button>
  )
}
