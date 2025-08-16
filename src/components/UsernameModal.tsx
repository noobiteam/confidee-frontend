'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface UsernameModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (username: string) => void
    currentUsername?: string
    isEditing?: boolean
}

export default function UsernameModal({ isOpen, onClose, onSubmit, currentUsername = '', isEditing = false }: UsernameModalProps) {
    const [username, setUsername] = useState('')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            setUsername(currentUsername)
        }
    }, [isOpen, currentUsername])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (username.trim() && username.length >= 3) {
            onSubmit(username.trim())
            setUsername('')
            onClose()
        }
    }

    const handleClose = () => {
        if (isEditing) {
            onClose()
        }
    }

    const isValidUsername = username.trim().length >= 3 && username.trim().length <= 20

    if (!mounted || !isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>

            <div className="relative bg-white rounded-2xl p-6 sm:p-8 mx-4 w-full max-w-md shadow-xl">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {isEditing ? 'Edit your username' : 'Choose your username'}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {isEditing
                            ? 'Update how others see you in the community'
                            : 'This is how others will see you in the community'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={20}
                            autoFocus
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                                3-20 characters
                            </span>
                            <span className="text-xs text-gray-500">
                                {username.length}/20
                            </span>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={!isValidUsername}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
                        >
                            {isEditing ? 'Save' : 'Continue'}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        {isEditing ? 'Your username will be updated immediately' : 'You can change this later in settings'}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    )
}