'use client'

import { useState, useCallback } from 'react'
import { toast } from '@/lib/toast'

interface UseAsyncActionOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useAsyncAction(options: UseAsyncActionOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | undefined> => {
    if (isLoading) return undefined

    setIsLoading(true)
    try {
      const result = await asyncFn()
      if (options.successMessage) {
        toast.success(options.successMessage)
      }
      options.onSuccess?.()
      return result
    } catch (error) {
      const message = options.errorMessage || (error instanceof Error ? error.message : 'An error occurred')
      toast.error(options.errorMessage || 'Error', message)
      options.onError?.(error instanceof Error ? error : new Error(String(error)))
      return undefined
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, options])

  return { isLoading, execute }
}
