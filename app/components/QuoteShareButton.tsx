'use client'

import { useState } from 'react'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import Button from '@/app/components/Button'

interface QuoteShareButtonProps {
  quoteText: string
  bookTitle: string
  author?: string
}

export default function QuoteShareButton({ quoteText, bookTitle, author }: QuoteShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    setIsLoading(true)
    try {
      const { generateQuoteImage, downloadImage } = await import('@/lib/utils/quote-image')
      const blob = await generateQuoteImage({
        text: quoteText,
        bookTitle,
        author,
      })

      const timestamp = new Date().getTime()
      downloadImage(blob, `quote-${timestamp}.png`)
    } catch (error) {
      console.error('Failed to generate quote image:', error)
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
      title="Download as Instagram Story image"
    >
      <PixelArtIcon name="Upload" size={16} />
      {isLoading ? 'Creating...' : 'Share'}
    </Button>
  )
}
