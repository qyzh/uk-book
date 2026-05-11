/**
 * Icon mapping from Lucide icons to Pixel Art Icons
 * Maps lucide icon names to pixelarticons component names
 */

export const iconMap: Record<string, string> = {
  // Status & Indicators
  CheckCircle: 'Check',
  AlertCircle: 'SquareAlert',
  AlertTriangle: 'SquareAlert',
  XCircle: 'Delete', // Fallback for X in circle
  Info: 'InfoBox',

  // Content & Media
  BookOpen: 'BookOpen',
  Bookmark: 'Bookmark',
  BookMarked: 'Bookmark',
  Library: 'Library',
  Quote: 'QuoteTextInline',
  TextQuote: 'QuoteTextInline',
  MessageSquareHeart: 'Heart',

  // Navigation & UI
  ChevronLeft: 'ChevronLeft',
  ChevronRight: 'ChevronRight',
  Clock: 'Clock',
  Lock: 'Lock',
  Globe: 'Globe',

  // Actions
  Plus: 'Plus',
  Search: 'Search',
  Pencil: 'Download', // Temp fallback - may need custom SVG
  Trash2: 'Delete',
  Star: 'Heart', // Fallback - star not in free tier
  Share2: 'Upload', // Fallback - share not available
  X: 'Delete', // Fallback for close action
  LightbulbOff: 'LightbulbOff',

  // Admin/Content
  NotebookPen: 'Notebook',
  Users: 'Users',
  LogOut: 'Logout',
  Tag: 'IconCategory', // Fallback for tags
} as const

/**
 * Get the pixel art icon name for a lucide icon
 * Falls back to the original name if no mapping exists
 */
export function getPixelIconName(lucideIconName: string): string {
  return iconMap[lucideIconName as keyof typeof iconMap] || lucideIconName
}

/**
 * Icons that may need custom implementations or workarounds
 * These don't have exact equivalents in the free tier
 */
export const needsCustom = [
  'Star', // Not in free tier - using Heart as fallback
  'Share2', // Not in free tier - using Upload as fallback
  'X', // Not in free tier - using Delete as fallback
  'Pencil', // Not in free tier - using Download as fallback
]
