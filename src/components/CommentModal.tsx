'use client'

import { useState } from 'react'
import BaseModal from './BaseModal'
import { CONTENT_LIMITS } from '@/constants/app'
import { getUserFriendlyError } from '@/utils/errorMessages'

interface CommentModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (content: string) => Promise<void>
}

export default function CommentModal({ isOpen, onClose, onSubmit }: CommentModalProps) {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        setError('')

        try {
            await onSubmit(content.trim())
            setContent('')
            onClose()
        } catch (err) {
            console.error('Error commenting:', err)
            setError(getUserFriendlyError(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetAndClose = () => {
        setContent('')
        setError('')
        onClose()
    }

    const characterCount = content.length
    const maxLength = CONTENT_LIMITS.COMMENT_MAX_LENGTH
    const warningThreshold = maxLength * CONTENT_LIMITS.WARNING_THRESHOLD
    const dangerThreshold = maxLength * CONTENT_LIMITS.DANGER_THRESHOLD

    // Determine character counter color
    const getCounterColor = () => {
        if (characterCount >= dangerThreshold) return 'text-red-600'
        if (characterCount >= warningThreshold) return 'text-yellow-600'
        return 'text-gray-500'
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={resetAndClose}
            title="Add Comment"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your supportive thoughts..."
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-900 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    maxLength={maxLength}
                    disabled={isSubmitting}
                />

                {/* Character Counter */}
                <div className={`text-xs sm:text-sm mb-4 text-right font-medium ${getCounterColor()}`}>
                    {characterCount}/{maxLength}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!content.trim() || isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            </form>
        </BaseModal>
    )
}
