import html2canvas from 'html2canvas'

export interface QuoteImageData {
  text: string
  bookTitle: string
  author?: string
}

export interface BookImageData {
  title: string
  author?: string
  coverUrl?: string
  status?: 'to-read' | 'reading' | 'completed' | 'wishlist'
}

const statusBadges: Record<string, string> = {
  'to-read': 'Up Next',
  'reading': 'Currently Reading',
  'completed': 'Just Finished',
  'wishlist': 'Want-to-Read',
}

export async function generateQuoteImage(data: QuoteImageData): Promise<Blob> {
  // Create temporary container for rendering
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '-9999px'
  container.style.left = '-9999px'
  container.style.width = '1080px'
  container.style.height = '1920px'
  container.style.background = '#0d0d10' // Claude dark background
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.padding = '120px' // Clean edge padding
  container.style.boxSizing = 'border-box'
  container.style.position = 'relative'

  // Small quote icon tucked top-left like the image
  const quoteMark = document.createElement('div')
  quoteMark.style.position = 'absolute'
  quoteMark.style.top = '120px'
  quoteMark.style.left = '120px'
  quoteMark.style.color = '#f4f4f5'
  quoteMark.style.fontSize = '120px'
  quoteMark.style.fontFamily = 'serif'
  quoteMark.style.lineHeight = '1'
  quoteMark.innerHTML = '❝' 
  container.appendChild(quoteMark)

  // Quote Content Wrapper (vertically centers the text)
  const contentWrapper = document.createElement('div')
  contentWrapper.style.flex = '1'
  contentWrapper.style.display = 'flex'
  contentWrapper.style.flexDirection = 'column'
  contentWrapper.style.justifyContent = 'center'
  contentWrapper.style.alignItems = 'flex-start' // Exactly left aligned
  contentWrapper.style.zIndex = '10'

  // Quote text
  const quoteText = document.createElement('div')
  quoteText.style.fontSize = '76px' // Big, proud text like in the image
  quoteText.style.fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
  quoteText.style.fontWeight = '400'
  quoteText.style.color = '#f4f4f5'
  quoteText.style.lineHeight = '1.4'
  quoteText.style.marginBottom = '40px'
  quoteText.style.wordWrap = 'break-word'
  quoteText.innerHTML = data.text
  
  contentWrapper.appendChild(quoteText)

  // Author / Book Details
  const authorText = document.createElement('div')
  authorText.style.fontSize = '40px'
  authorText.style.fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
  authorText.style.color = '#ea580c' // The beloved Claude orange
  authorText.style.fontWeight = '400'
  
  let infoHtml = `-${data.bookTitle}`
  if (data.author && data.author.trim() !== '') {
    infoHtml = `${data.author} — ${data.bookTitle}`
  }
  authorText.style.textTransform = 'lowercase' // Matches the lowercase vibe of the screenshot
  authorText.innerHTML = infoHtml
  contentWrapper.appendChild(authorText)

  container.appendChild(contentWrapper)

  // Website link at the bottom of the image
  const webLink = document.createElement('div')
  webLink.style.position = 'absolute'
  webLink.style.bottom = '80px'
  webLink.style.left = '120px' // Left aligned along with everything else
  webLink.style.fontSize = '32px'
  webLink.style.fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
  webLink.style.color = '#71717a'
  webLink.style.letterSpacing = '1px'
  webLink.innerHTML = 'uk-book.vercel.app'
  
  container.appendChild(webLink)

  // Append to body temporarily
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, {
      width: 1080,
      height: 1920,
      scale: 1,
      backgroundColor: '#0d0d10',
    })

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
    document.body.removeChild(container)
  }
}

export async function generateBookImage(data: BookImageData): Promise<Blob> {
  // Create temporary container for rendering
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '-9999px'
  container.style.left = '-9999px'
  container.style.width = '1080px'
  container.style.height = '1920px'
  
  // Premium slate dark background falling off to pitch dark
  container.style.background = 'radial-gradient(circle at 50% 40%, #2a2d36 0%, #111216 100%)'
  
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.justifyContent = 'space-between'
  container.style.alignItems = 'center'
  container.style.padding = '120px 80px'
  container.style.boxSizing = 'border-box'
  container.style.position = 'relative'
  container.style.overflow = 'hidden'

  // Soft backlight specifically behind the book
  const centerGlow = document.createElement('div')
  centerGlow.style.position = 'absolute'
  centerGlow.style.top = '45%' // slightly higher than true center
  centerGlow.style.left = '50%'
  centerGlow.style.transform = 'translate(-50%, -50%)'
  centerGlow.style.width = '700px'
  centerGlow.style.height = '1000px'
  centerGlow.style.background = 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)'
  centerGlow.style.pointerEvents = 'none'
  container.appendChild(centerGlow)

  // Wrapper for all content
  const content = document.createElement('div')
  content.style.position = 'relative'
  content.style.zIndex = '10'
  content.style.display = 'flex'
  content.style.flexDirection = 'column'
  content.style.justifyContent = 'space-between'
  content.style.alignItems = 'center'
  content.style.height = '100%'
  content.style.width = '100%'

  // --- TOP SECTION ---
  const topSection = document.createElement('div')
  topSection.style.display = 'flex'
  topSection.style.justifyContent = 'center'
  topSection.style.width = '100%'

  // Status badge at top
  if (data.status) {
    const statusText = document.createElement('div')
    statusText.style.fontSize = '28px'
    statusText.style.fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    statusText.style.fontWeight = '600'
    statusText.style.color = '#ea580c'
    statusText.style.letterSpacing = '5px'
    statusText.style.textTransform = 'uppercase'
    statusText.style.marginTop = '20px' // Breathing room at the top
    statusText.innerHTML = statusBadges[data.status]
    
    topSection.appendChild(statusText)
  }
  content.appendChild(topSection)

  // --- MIDDLE SECTION (Cover + Title) ---
  const midSection = document.createElement('div')
  midSection.style.display = 'flex'
  midSection.style.flexDirection = 'column'
  midSection.style.alignItems = 'center'
  midSection.style.justifyContent = 'center'
  midSection.style.gap = '60px'

  // Book cover image
  const bookCover = document.createElement('img')
  if (data.coverUrl) {
    bookCover.src = data.coverUrl
    bookCover.style.height = '850px' 
    bookCover.style.width = 'auto'
    bookCover.style.maxWidth = '800px'
    bookCover.style.objectFit = 'cover'
    bookCover.style.borderRadius = '8px' // Books usually have sharp or slightly rounded corners
    // Premium multi-layered drop shadow for 3D float effect
    bookCover.style.boxShadow = '30px 40px 60px rgba(0, 0, 0, 0.6), 0 0 100px rgba(0, 0, 0, 0.3), inset 2px 0 0 rgba(255, 255, 255, 0.2)'
  } else {
    // Elegant Placeholder if no cover
    bookCover.style.width = '550px'
    bookCover.style.height = '850px'
    bookCover.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
    bookCover.style.borderRadius = '8px'
    bookCover.style.border = '1px solid #374151'
    bookCover.style.boxShadow = '30px 40px 60px rgba(0, 0, 0, 0.6)'
  }
  midSection.appendChild(bookCover)

  // Book info container
  const titleBlock = document.createElement('div')
  titleBlock.style.display = 'flex'
  titleBlock.style.flexDirection = 'column'
  titleBlock.style.alignItems = 'center'
  titleBlock.style.gap = '20px'

  // Book title
  const bookTitle = document.createElement('div')
  bookTitle.style.fontSize = '50px'
  // Elegant serif for titles like the mockup
  bookTitle.style.fontFamily = 'Georgia, "Times New Roman", serif'
  bookTitle.style.fontWeight = '400'
  bookTitle.style.textAlign = 'center'
  bookTitle.style.color = '#f8fafc'
  bookTitle.style.maxWidth = '900px'
  bookTitle.style.lineHeight = '1.3'
  bookTitle.innerHTML = data.title
  titleBlock.appendChild(bookTitle)

  // Author if available
  if (data.author) {
    const authorInfo = document.createElement('div')
    authorInfo.style.fontSize = '24px'
    authorInfo.style.fontFamily = '"Inter", -apple-system, sans-serif'
    authorInfo.style.fontWeight = '500'
    authorInfo.style.color = '#ea580c' // Incorporate the Claude orange
    authorInfo.style.letterSpacing = '3px'
    authorInfo.style.textTransform = 'uppercase'
    authorInfo.innerHTML = data.author
    titleBlock.appendChild(authorInfo)
  }

  midSection.appendChild(titleBlock)
  content.appendChild(midSection)

  // --- BOTTOM SECTION ---
  const bottomSection = document.createElement('div')
  bottomSection.style.display = 'flex'
  bottomSection.style.justifyContent = 'center'
  bottomSection.style.width = '100%'

  // Web link
  const webLink = document.createElement('div')
  webLink.style.fontSize = '26px'
  webLink.style.fontWeight = '400'
  webLink.style.fontFamily = '"Inter", -apple-system, sans-serif'
  webLink.style.color = '#64748b' // Slate subtle grey
  webLink.style.letterSpacing = '2px'
  webLink.innerHTML = 'uk-book.vercel.app'
  bottomSection.appendChild(webLink)

  content.appendChild(bottomSection)

  container.appendChild(content)

  // Append to body momentarily for capture
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, {
      width: 1080,
      height: 1920,
      scale: 1,
      backgroundColor: '#111216',
      useCORS: true,
      allowTaint: true,
    })

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
