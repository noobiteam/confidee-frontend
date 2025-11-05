'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
    message: string
    type: ToastType
    onClose: () => void
    duration?: number // 0 means no auto-dismiss
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-500',
                    icon: 'text-green-500',
                    text: 'text-green-800',
                    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                }
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-500',
                    icon: 'text-red-500',
                    text: 'text-red-800',
                    iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                }
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-500',
                    icon: 'text-yellow-500',
                    text: 'text-yellow-800',
                    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                }
            case 'info':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-500',
                    icon: 'text-blue-500',
                    text: 'text-blue-800',
                    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                }
        }
    }

    const styles = getToastStyles()

    return createPortal(
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] max-w-md w-full mx-4 animate-slide-down">
            <div className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded-r-xl shadow-lg`}>
                <div className="flex items-start">
                    <svg
                        className={`w-5 h-5 ${styles.icon} mt-0.5 mr-3 flex-shrink-0`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={styles.iconPath}
                        />
                    </svg>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`ml-3 ${styles.icon} hover:opacity-70 transition-opacity`}
                        aria-label="Close notification"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
