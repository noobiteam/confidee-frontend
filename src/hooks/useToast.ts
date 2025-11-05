import { useState, useCallback } from 'react'
import { ToastType } from '@/components/Toast'

interface ToastState {
    message: string
    type: ToastType
    id: number
}

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null)

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({
            message,
            type,
            id: Date.now()
        })
    }, [])

    const hideToast = useCallback(() => {
        setToast(null)
    }, [])

    // Convenience methods
    const success = useCallback((message: string) => showToast(message, 'success'), [showToast])
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast])
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast])
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast])

    return {
        toast,
        showToast,
        hideToast,
        success,
        error,
        warning,
        info,
    }
}
