'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'

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
    <button
      onClick={handleShare}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded border border-slate-600 text-slate-300 hover:border-[#d97757] hover:text-[#d97757] transition disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download as Instagram Story image"
    >
      <Share2 className="w-4 h-4" />
      {isLoading ? 'Creating...' : 'Share'}
    </button>
  )
}
