'use client'

import { ToastProvider } from '@/lib/hooks/useToast'
import Toast from '@/components/Toast'

export default function ToastLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toast />
    </ToastProvider>
  )
}
