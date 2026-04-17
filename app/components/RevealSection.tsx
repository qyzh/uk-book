'use client'

import { useEffect, useRef, type ReactNode, type ElementType } from 'react'

type Variant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'

interface RevealSectionProps {
  children: ReactNode
  variant?: Variant
  delay?: number          // ms
  threshold?: number
  rootMargin?: string
  className?: string
  stagger?: boolean       // adds reveal-stagger to cascade grid children
  as?: ElementType
}

export default function RevealSection({
  children,
  variant = 'up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -60px 0px',
  className = '',
  stagger = false,
  as: Tag = 'div',
}: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.classList.add('in-view')
      return
    }

    if (delay) el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold, rootMargin])

  const variantClass = variant !== 'none' ? `reveal reveal-${variant}` : ''
  const staggerClass = stagger ? 'reveal-stagger' : ''

  return (
    <Tag ref={ref} className={[variantClass, staggerClass, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
