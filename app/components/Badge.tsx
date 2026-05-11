import React from 'react'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import type * as PixelIcons from 'pixelarticons/react'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'primary' | 'completed' | 'reading' | 'wishlist' | 'to-read'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | string
  children: React.ReactNode
  showIcon?: boolean
}

export function Badge({ variant = 'default', className = '', children, showIcon = true, ...props }: BadgeProps) {
  let variantStyles = 'bg-slate-800 text-slate-300' // default
  let iconName: keyof typeof PixelIcons = 'Clock'
  
  // Custom mappings for book statuses and generic variants
  if (variant === 'completed' || variant === 'success') {
    variantStyles = 'bg-emerald-900 text-emerald-300'
    iconName = 'Check' as keyof typeof PixelIcons
  } else if (variant === 'reading' || variant === 'primary') {
    variantStyles = 'bg-[#d97757]/20 text-[#d97757]'
    iconName = 'BookOpen' as keyof typeof PixelIcons
  } else if (variant === 'wishlist' || variant === 'info') {
    variantStyles = 'bg-blue-900 text-blue-300'
    iconName = 'Bookmark' as keyof typeof PixelIcons
  } else if (variant === 'warning') {
    variantStyles = 'bg-yellow-900/50 text-yellow-500'
    iconName = 'SquareAlert' as keyof typeof PixelIcons
  }

  return (
    <span 
      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1.5 rounded inline-flex items-center gap-1.5 justify-center ${variantStyles} ${className}`}
      {...props}
    >
      {showIcon && <PixelArtIcon name={iconName} size={12} />}
      <span className="translate-y-[0.5px]">{children}</span>
    </span>
  )
}
