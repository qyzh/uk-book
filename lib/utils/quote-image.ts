import html2canvas from 'html2canvas'

export interface QuoteImageData {
  text: string
  bookTitle: string
  author?: string
}

export async function generateQuoteImage(data: QuoteImageData): Promise<Blob> {
  // Create temporary container for rendering
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '-9999px'
  container.style.left = '-9999px'
  container.style.width = '1080px'
  container.style.height = '1920px'
  container.style.background = `
    linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 25%, #16213e 50%, #0f1419 75%, #1a1a2e 100%)
  `
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.justifyContent = 'space-between'
  container.style.alignItems = 'center'
  container.style.padding = '60px 40px'
  container.style.boxSizing = 'border-box'
  container.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  container.style.color = '#ffffff'
  container.style.position = 'relative'
  container.style.overflow = 'hidden'

  // Add decorative background elements
  const decorTop = document.createElement('div')
  decorTop.style.position = 'absolute'
  decorTop.style.top = '0'
  decorTop.style.left = '0'
  decorTop.style.right = '0'
  decorTop.style.height = '200px'
  decorTop.style.background = 'radial-gradient(circle at top right, rgba(147, 51, 234, 0.15) 0%, transparent 70%)'
  decorTop.style.pointerEvents = 'none'
  container.appendChild(decorTop)

  // Add decorative bottom elements
  const decorBottom = document.createElement('div')
  decorBottom.style.position = 'absolute'
  decorBottom.style.bottom = '0'
  decorBottom.style.left = '0'
  decorBottom.style.right = '0'
  decorBottom.style.height = '200px'
  decorBottom.style.background = 'radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
  decorBottom.style.pointerEvents = 'none'
  container.appendChild(decorBottom)

  // Content wrapper for z-index layering
  const content = document.createElement('div')
  content.style.position = 'relative'
  content.style.zIndex = '10'
  content.style.display = 'flex'
  content.style.flexDirection = 'column'
  content.style.justifyContent = 'space-between'
  content.style.alignItems = 'center'
  content.style.height = '100%'
  content.style.width = '100%'

  // Quote text
  const quoteText = document.createElement('div')
  quoteText.style.fontSize = '52px'
  quoteText.style.fontWeight = '700'
  quoteText.style.lineHeight = '1.5'
  quoteText.style.textAlign = 'center'
  quoteText.style.marginTop = '180px'
  quoteText.style.marginBottom = '40px'
  quoteText.style.flex = '1'
  quoteText.style.display = 'flex'
  quoteText.style.alignItems = 'center'
  quoteText.style.justifyContent = 'center'
  quoteText.style.wordWrap = 'break-word'
  quoteText.style.color = '#e2e8f0'
  quoteText.style.textShadow = '0 4px 20px rgba(0, 0, 0, 0.5)'
  quoteText.innerHTML = `"${data.text}"`
  content.appendChild(quoteText)

  // Book info with accent line
  const bookInfoContainer = document.createElement('div')
  bookInfoContainer.style.display = 'flex'
  bookInfoContainer.style.flexDirection = 'column'
  bookInfoContainer.style.alignItems = 'center'
  bookInfoContainer.style.gap = '20px'
  bookInfoContainer.style.marginBottom = '120px'

  // Accent line above book info
  const accentLine = document.createElement('div')
  accentLine.style.width = '60px'
  accentLine.style.height = '3px'
  accentLine.style.background = 'linear-gradient(90deg, transparent, #a855f7, transparent)'
  accentLine.style.borderRadius = '2px'
  bookInfoContainer.appendChild(accentLine)

  // Book title section
  const bookInfo = document.createElement('div')
  bookInfo.style.fontSize = '36px'
  bookInfo.style.fontWeight = '600'
  bookInfo.style.textAlign = 'center'
  bookInfo.style.color = '#d1d5db'
  bookInfo.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.4)'
  bookInfo.innerHTML = `— ${data.bookTitle}`
  bookInfoContainer.appendChild(bookInfo)

  // Author info if available
  if (data.author) {
    const authorInfo = document.createElement('div')
    authorInfo.style.fontSize = '24px'
    authorInfo.style.fontWeight = '400'
    authorInfo.style.color = '#9ca3af'
    authorInfo.style.textShadow = '0 1px 5px rgba(0, 0, 0, 0.3)'
    authorInfo.innerHTML = `by ${data.author}`
    bookInfoContainer.appendChild(authorInfo)
  }

  content.appendChild(bookInfoContainer)

  // Web link (bottom)
  const webLink = document.createElement('div')
  webLink.style.fontSize = '28px'
  webLink.style.fontWeight = '600'
  webLink.style.textAlign = 'center'
  webLink.style.color = '#a855f7'
  webLink.style.textShadow = '0 2px 8px rgba(168, 85, 247, 0.3)'
  webLink.style.letterSpacing = '0.5px'
  webLink.innerHTML = 'uk-book.vercel.app'
  content.appendChild(webLink)

  container.appendChild(content)

  // Append to body
  document.body.appendChild(container)

  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      width: 1080,
      height: 1920,
      scale: 1,
      backgroundColor: '#0f0f1e',
    })

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to generate image'))
          }
        },
        'image/png',
        0.95
      )
    })
  } finally {
    // Cleanup
    document.body.removeChild(container)
  }
}

export function downloadImage(blob: Blob, filename: string = 'quote-share.png'): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

