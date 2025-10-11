'use client'

import { useConnect } from 'wagmi'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

interface WalletModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { connectors, connect, isPending } = useConnect()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const handleWalletSelect = async (connector: typeof connectors[0]) => {
        try {
            connect({ connector })
            onClose()
        } catch (error) {
            console.error('Wallet connection failed:', error)
        }
    }

    if (!mounted || !isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl p-6 sm:p-8 mx-4 w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Connect Wallet</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    {connectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => handleWalletSelect(connector)}
                            disabled={isPending}
                            className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {connector.icon && (
                                <img
                                    src={connector.icon}
                                    alt={connector.name}
                                    className="w-8 h-8"
                                />
                            )}
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">{connector.name}</div>
                                <div className="text-sm text-gray-500">
                                    {isPending ? 'Connecting...' : 'Connect with your wallet'}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        By connecting, you agree to our{' '}
                        <Link
                            href="/terms"
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700 underline"
                        >
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link
                            href="/privacy"
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700 underline"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>,
        document.body
    )
}