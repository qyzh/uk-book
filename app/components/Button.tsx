'use client'

import Link from 'next/link'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const variantMap: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  destructive: 'btn-destructive',
}

const sizeMap: Record<Size, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  icon: 'btn-icon',
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  loading,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = cx('btn', variantMap[variant], sizeMap[size], className)
  const isDisabled = disabled || loading

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={isDisabled ? 'true' : undefined} tabIndex={isDisabled ? -1 : undefined}>
        {loading && <Spinner />}
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} type={type} disabled={isDisabled} {...rest}>
      {loading && <Spinner />}
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
