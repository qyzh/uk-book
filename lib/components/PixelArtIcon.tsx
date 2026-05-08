import React from 'react'
import * as PixelIcons from 'pixelarticons/react'

interface PixelArtIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Icon name in PascalCase (e.g., 'Check', 'BookOpen', 'Plus')
   */
  name: keyof typeof PixelIcons
  /**
   * Size in pixels - defaults to 24px (standard pixel art icon size)
   * Supports: 12, 16, 20, 24, 32, 48, 72, 96 for crisp rendering
   */
  size?: 12 | 16 | 20 | 24 | 32 | 48 | 72 | 96
  /**
   * Alternative to size - use w/h Tailwind classes
   */
  width?: number | string
  height?: number | string
  /**
   * CSS class for styling
   */
  className?: string
  /**
   * Color (uses currentColor by default for Tailwind color control)
   */
  color?: string
  /**
   * Accessibility label
   */
  'aria-label'?: string
}

/**
 * Wrapper component for Pixel Art Icons
 * Provides consistent sizing, styling, and props across the app
 */
export const PixelArtIcon: React.FC<PixelArtIconProps> = ({
  name,
  size = 24,
  width,
  height,
  className = '',
  color = 'currentColor',
  ...props
}) => {
    // Get the icon component from pixelarticons
    const IconComponent = (PixelIcons as Record<string, React.ComponentType<{ width: number; height: number }>>)[name]

    if (!IconComponent) {
      console.warn(`PixelArtIcon: Icon "${String(name)}" not found`)
      return null
    }

    // Determine width/height
    const w = (width ? Number(width) : undefined) ?? size
    const h = (height ? Number(height) : undefined) ?? size

    // Default styling for pixel art icons
    const defaultClassName = 'shrink-0'

    return (
      <span
        className={`${defaultClassName} ${className}`.trim()}
        style={{ color, display: 'inline-flex' }}
      >
        <IconComponent
          width={w}
          height={h}
          {...props}
        />
      </span>
    )
}

PixelArtIcon.displayName = 'PixelArtIcon'

/**
 * Quick shortcut icons for common sizes
 */
export const PixelIcon = {
  /**
   * Small icon (16px) - for badges, inline text
   */
  Small: (props: Omit<PixelArtIconProps, 'size'>) => (
    <PixelArtIcon {...props} size={16} />
  ),

  /**
   * Medium icon (24px) - default size
   */
  Medium: (props: Omit<PixelArtIconProps, 'size'>) => (
    <PixelArtIcon {...props} size={24} />
  ),

  /**
   * Large icon (48px) - for hero sections
   */
  Large: (props: Omit<PixelArtIconProps, 'size'>) => (
    <PixelArtIcon {...props} size={48} />
  ),
}
