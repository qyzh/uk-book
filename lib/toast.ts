import { ToastType } from '@/lib/hooks/useToast'

let toastHandler: ((type: ToastType, title: string, message?: string) => void) | null = null

export function registerToastHandler(handler: (type: ToastType, title: string, message?: string) => void) {
  toastHandler = handler
}

export const toast = {
  success: (title: string, message?: string) => toastHandler?.('success', title, message),
  error: (title: string, message?: string) => toastHandler?.('error', title, message),
  warning: (title: string, message?: string) => toastHandler?.('warning', title, message),
  info: (title: string, message?: string) => toastHandler?.('info', title, message),
}
