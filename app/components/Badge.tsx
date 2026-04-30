import React from 'react'
import { CheckCircle, BookOpen, Bookmark, Clock, AlertCircle } from 'lucide-react'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'primary' | 'completed' | 'reading' | 'wishlist' | 'to-read'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | string
  children: React.ReactNode
  showIcon?: boolean
}

export function Badge({ variant = 'default', className = '', children, showIcon = true, ...props }: BadgeProps) {
  let variantStyles = 'bg-slate-800 text-slate-300' // default
  let Icon = Clock
  
  // Custom mappings for book statuses and generic variants
  if (variant === 'completed' || variant === 'success') {
    variantStyles = 'bg-emerald-900 text-emerald-300'
    Icon = CheckCircle
  } else if (variant === 'reading' || variant === 'primary') {
    variantStyles = 'bg-[#d97757]/20 text-[#d97757]'
    Icon = BookOpen
  } else if (variant === 'wishlist' || variant === 'info') {
    variantStyles = 'bg-blue-900 text-blue-300'
    Icon = Bookmark
  } else if (variant === 'warning') {
    variantStyles = 'bg-yellow-900/50 text-yellow-500'
    Icon = AlertCircle
  }

  return (
    <span 
      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1.5 rounded inline-flex items-center gap-1.5 justify-center ${variantStyles} ${className}`}
      {...props}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span className="translate-y-[0.5px]">{children}</span>
    </span>
  )
}
