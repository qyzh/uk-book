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
  container.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.justifyContent = 'space-between'
  container.style.alignItems = 'center'
  container.style.padding = '60px 40px'
  container.style.boxSizing = 'border-box'
  container.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  container.style.color = '#ffffff'

  // Quote text
  const quoteText = document.createElement('div')
  quoteText.style.fontSize = '48px'
  quoteText.style.fontWeight = '600'
  quoteText.style.lineHeight = '1.6'
  quoteText.style.textAlign = 'center'
  quoteText.style.marginTop = '200px'
  quoteText.style.marginBottom = '40px'
  quoteText.style.flex = '1'
  quoteText.style.display = 'flex'
  quoteText.style.alignItems = 'center'
  quoteText.style.justifyContent = 'center'
  quoteText.style.wordWrap = 'break-word'
  quoteText.innerHTML = `"${data.text}"`
  container.appendChild(quoteText)

  // Book title section (middle)
  const bookInfo = document.createElement('div')
  bookInfo.style.fontSize = '32px'
  bookInfo.style.fontWeight = '500'
  bookInfo.style.textAlign = 'center'
  bookInfo.style.marginBottom = '100px'
  bookInfo.style.color = '#a0aec0'
  bookInfo.innerHTML = `— ${data.bookTitle}`
  if (data.author) {
    bookInfo.innerHTML += `<div style="font-size: 24px; margin-top: 10px; color: '#cbd5e0';">${data.author}</div>`
  }
  container.appendChild(bookInfo)

  // Web link (bottom)
  const webLink = document.createElement('div')
  webLink.style.fontSize = '28px'
  webLink.style.fontWeight = '500'
  webLink.style.textAlign = 'center'
  webLink.style.marginTop = 'auto'
  webLink.style.color = '#a0aec0'
  webLink.innerHTML = 'uk-book.vercel.app'
  container.appendChild(webLink)

  // Append to body
  document.body.appendChild(container)

  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      width: 1080,
      height: 1920,
      scale: 1,
      backgroundColor: '#1a1a2e',
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
