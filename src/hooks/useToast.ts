import { useState, useCallback } from 'react'
import { ToastType } from '@/components/Toast'

interface ToastState {
    message: string
    type: ToastType
    id: number
    duration?: number
}

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null)

    const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
        setToast({
            message,
            type,
            id: Date.now(),
            duration
        })
    }, [])

    const hideToast = useCallback(() => {
        setToast(null)
    }, [])

    // Convenience methods with configurable duration
    // Blockchain operations get longer durations (8 seconds)
    const success = useCallback((message: string, duration?: number) =>
        showToast(message, 'success', duration ?? 5000), [showToast])
    const error = useCallback((message: string, duration?: number) =>
        showToast(message, 'error', duration ?? 8000), [showToast]) // Longer for errors
    const warning = useCallback((message: string, duration?: number) =>
        showToast(message, 'warning', duration ?? 6000), [showToast])
    const info = useCallback((message: string, duration?: number) =>
        showToast(message, 'info', duration ?? 5000), [showToast])

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
