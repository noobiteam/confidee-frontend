'use client'

import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'
import { useConfideeContract, useGetLatestSecrets, useGetLikeCount, useHasUserLiked, useGetCommentCount, useGetTotalTips, useGetTotalSecrets } from '@/hooks/useConfideeContract'
import { formatDate } from '@/utils/dateFormatter'

export default function DashboardPage() {
    const { address } = useAccount()
    const router = useRouter()
    const { createSecret, isWritePending, isConfirming, isConfirmed } = useConfideeContract()
    const { secrets, isLoading: secretsLoading, refetch } = useGetLatestSecrets(50)
    const { total: totalSecrets } = useGetTotalSecrets()

    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [postContent, setPostContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    useEffect(() => {
        if (!address) {
            router.push('/')
        } else {
            // Show loading for smooth transition
            const timer = setTimeout(() => {
                setIsInitialLoading(false)
            }, 800)
            return () => clearTimeout(timer)
        }
    }, [address, router])

    useEffect(() => {
        if (isConfirmed && success) {
            // Refetch secrets after successful post
            refetch()
            setSuccess(false)
        }
    }, [isConfirmed, success, refetch])

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        if (!postContent.trim()) {
            setError('Please write something to share')
            setIsSubmitting(false)
            return
        }

        if (postContent.length > 1000) {
            setError('Post is too long (max 1000 characters)')
            setIsSubmitting(false)
            return
        }

        try {
            // Step 1: Save to blockchain
            await createSecret(postContent)

            // Step 2: The new secret ID will be totalSecrets + 1
            const newSecretId = totalSecrets + 1

            setSuccess(true)
            const savedContent = postContent // Save content before clearing
            setPostContent('')
            setIsPostModalOpen(false)

            // Step 3: Trigger AI reply in background (fully automatic!)
            setTimeout(async () => {
                try {
                    const response = await fetch('/api/ai-reply', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            postContent: savedContent,
                            secretId: newSecretId
                        })
                    })

                    if (response.ok) {
                        console.log('✅ AI reply generated & added to blockchain!')
                    }
                } catch (error) {
                    console.error('AI reply error (non-blocking):', error)
                }

                // Refetch to show new post with AI reply
                setTimeout(() => refetch(), 2000)
            }, 4000) // Wait for blockchain confirmation

        } catch (err) {
            console.error('Error creating post:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to create post'
            setError(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!address) {
        return null
    }

    // Show loading screen during initial load
    if (isInitialLoading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
                <div className="relative text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-6"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                    <p className="text-gray-600">Loading your safe space...</p>
                    <div className="mt-8 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
            <div className="relative flex-1">
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                Confidee
                            </Link>
                            <WalletButton />
                        </div>
                    </div>
                </nav>

                <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Global Anonymous Feed
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
                            Share your thoughts anonymously, visible to everyone on-chain
                        </p>

                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            disabled={isWritePending || isConfirming}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors disabled:bg-gray-400"
                        >
                            {isWritePending || isConfirming ? 'Posting...' : 'Share Your Thoughts'}
                        </button>

                        {success && (
                            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                                Post successfully added to blockchain! 🎉
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>
                </section>

                <section className="pb-12 sm:pb-20 px-4 sm:px-6 md:px-8 lg:px-20">
                    <div className="mx-auto max-w-7xl">
                        {secretsLoading ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Loading posts from blockchain...</p>
                            </div>
                        ) : secrets.length > 0 ? (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                {secrets.map((secret) => (
                                    <PostCard
                                        key={secret.id.toString()}
                                        secret={secret}
                                        currentWallet={address || ''}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="rounded-2xl p-8 sm:p-12">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        No posts yet
                                    </h3>
                                    <p className="text-gray-600">
                                        Be the first to share your thoughts!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Footer />

            {/* Create Post Modal */}
            {isPostModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Share your thoughts</h2>
                            <button
                                onClick={() => setIsPostModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind? This will be visible to everyone on the blockchain..."
                                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                                disabled={isSubmitting}
                                maxLength={1000}
                            />

                            <div className="mt-2 text-right text-sm text-gray-500">
                                {postContent.length}/1000 characters
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
                                <p className="font-semibold mb-1">🌐 Public & On-Chain</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Stored permanently on Base Sepolia blockchain</li>
                                    <li>Visible to everyone (anonymous by wallet)</li>
                                    <li>Cannot be edited or deleted once posted</li>
                                </ul>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsPostModalOpen(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !postContent.trim()}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Posting to Blockchain...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

// Component untuk render individual post
function PostCard({ secret, currentWallet }: {
    secret: {
        id: bigint;
        owner: string;
        content: string;
        timestamp: bigint;
        isActive: boolean;
        aiReply?: string;
        aiReplyTimestamp?: bigint;
        totalTips?: bigint;
    },
    currentWallet: string
}) {
    const router = useRouter()
    const [showTipModal, setShowTipModal] = useState(false)
    const [tipAmount, setTipAmount] = useState('')
    const [isTipping, setIsTipping] = useState(false)
    const [error, setError] = useState('')

    const { data: balance } = useBalance({
        address: currentWallet as `0x${string}`,
    })
    const { likeSecret, unlikeSecret, tipPost } = useConfideeContract()
    const { likeCount, refetch: refetchLikes } = useGetLikeCount(secret.id)
    const { hasLiked, refetch: refetchHasLiked } = useHasUserLiked(secret.id, currentWallet as `0x${string}`)
    const { commentCount } = useGetCommentCount(secret.id)
    const { totalTips, refetch: refetchTips } = useGetTotalTips(secret.id)

    const timeAgo = formatDate(new Date(Number(secret.timestamp) * 1000))
    const isOwnPost = secret.owner.toLowerCase() === currentWallet.toLowerCase()

    // Helper function to parse user-friendly error messages
    const getUserFriendlyError = (err: unknown): string => {
        if (!(err instanceof Error)) return 'An unexpected error occurred'

        const errorMessage = err.message.toLowerCase()

        // User rejected transaction
        if (errorMessage.includes('user rejected') ||
            errorMessage.includes('user denied') ||
            errorMessage.includes('user cancelled')) {
            return 'Transaction cancelled. No worries, you can try again anytime! 😊'
        }

        // Insufficient funds
        if (errorMessage.includes('insufficient funds') ||
            errorMessage.includes('insufficient balance')) {
            return 'Insufficient funds in your wallet. Please add more ETH and try again.'
        }

        // Network issues
        if (errorMessage.includes('network') ||
            errorMessage.includes('connection')) {
            return 'Network error. Please check your connection and try again.'
        }

        // Generic fallback
        return err.message
    }

    const handleCardClick = () => {
        router.push(`/post/${secret.id}`)
    }

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setError('')
        try {
            if (hasLiked === true) {
                await unlikeSecret(secret.id)
            } else {
                await likeSecret(secret.id)
            }
            // Refetch after transaction
            setTimeout(() => {
                refetchLikes()
                refetchHasLiked()
            }, 2000)
        } catch (error) {
            console.error('Error toggling like:', error)
            const errorMsg = getUserFriendlyError(error)
            setError(errorMsg)
            // Auto-dismiss error after 5 seconds
            setTimeout(() => setError(''), 5000)
        }
    }

    const handleTip = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tipAmount || parseFloat(tipAmount) <= 0) return

        setIsTipping(true)
        setError('')
        try {
            await tipPost(secret.id, tipAmount)
            setTipAmount('')
            setShowTipModal(false)
            // Refetch tips after transaction
            setTimeout(() => {
                refetchTips()
            }, 2000)
        } catch (error) {
            console.error('Error tipping post:', error)
            setError(getUserFriendlyError(error))
        } finally {
            setIsTipping(false)
        }
    }

    return (
        <div
            onClick={handleCardClick}
            className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
        >
            <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`${isOwnPost ? 'bg-blue-100' : 'bg-gray-100'} w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs sm:text-sm font-medium ${isOwnPost ? 'text-blue-600' : 'text-gray-600'}`}>
                        {isOwnPost ? 'YOU' : 'AU'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                        <span className={`text-xs sm:text-sm font-medium ${isOwnPost ? 'text-blue-600' : 'text-gray-500'}`}>
                            {isOwnPost ? 'You' : 'Anonymous User'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs sm:text-sm text-gray-500 truncate">{timeAgo}</span>
                    </div>

                    <div className="text-sm sm:text-base text-gray-900 mb-4 whitespace-pre-wrap break-words">
                        {secret.content}
                    </div>

                    {/* AI Reply - Highlighted in Feed */}
                    {secret.aiReply && secret.aiReply.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-r-xl mb-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" />
                                </svg>
                                <span className="text-sm font-semibold text-blue-900">AI Support Response</span>
                            </div>
                            <div className="text-sm text-blue-900 leading-relaxed">
                                {secret.aiReply}
                            </div>
                        </div>
                    )}

                    {/* View Details Button if there are comments */}
                    {(commentCount || 0) > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/post/${secret.id}`)
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center space-x-1"
                        >
                            <span>View {commentCount || 0} {(commentCount || 0) === 1 ? 'comment' : 'comments'}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Like, Comment, and Tip buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-1 hover:scale-105 transition-all ${
                                    hasLiked === true ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-red-600'
                                }`}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={hasLiked === true ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-xs sm:text-sm font-medium">{likeCount || 0}</span>
                            </button>

                            <div className="flex items-center space-x-1 text-gray-500">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-xs sm:text-sm font-medium">{commentCount || 0}</span>
                            </div>

                            {!isOwnPost && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowTipModal(true)
                                    }}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600 hover:scale-105 transition-all"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    <span className="text-xs sm:text-sm font-medium">Tip</span>
                                </button>
                            )}
                        </div>

                        {(totalTips || 0) > 0 && (
                            <div className="flex items-center space-x-1 text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                                </svg>
                                <span className="text-xs sm:text-sm font-medium">{(totalTips || 0).toFixed(4)} ETH</span>
                            </div>
                        )}
                    </div>

                    {/* Error Notification */}
                    {error && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-start">
                                <svg className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* BaseScan link - Always visible at bottom */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <a
                            href={`https://sepolia.basescan.org/address/0x49BaCB0B84b261Ee998CC057bA6ad25cC0Ff626F`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>View on BaseScan</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Tip Modal */}
            {showTipModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowTipModal(false)
                    }}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Tip this post</h3>
                            <button
                                onClick={() => setShowTipModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Support this anonymous user with ETH. 5% fee goes to platform.
                        </p>

                        <form onSubmit={handleTip}>
                            {/* Balance Display */}
                            {balance && (
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="text-sm font-medium text-blue-900">Your Balance</span>
                                        </div>
                                        <span className="text-lg font-bold text-blue-900">
                                            {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount (ETH)
                                </label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    min="0.0001"
                                    value={tipAmount}
                                    onChange={(e) => setTipAmount(e.target.value)}
                                    placeholder="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isTipping}
                                />

                                {/* Insufficient Balance Warning */}
                                {tipAmount && balance && parseFloat(tipAmount) > parseFloat(balance.formatted) && (
                                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-sm text-red-700">
                                            Insufficient balance! You only have {parseFloat(balance.formatted).toFixed(4)} ETH
                                        </p>
                                    </div>
                                )}
                            </div>

                            {tipAmount && parseFloat(tipAmount) > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Post owner receives:</span>
                                        <span className="font-medium text-gray-900">
                                            {(parseFloat(tipAmount) * 0.95).toFixed(4)} ETH
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Platform fee (5%):</span>
                                        <span className="font-medium text-gray-900">
                                            {(parseFloat(tipAmount) * 0.05).toFixed(4)} ETH
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTipModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    disabled={isTipping}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        isTipping ||
                                        !tipAmount ||
                                        parseFloat(tipAmount) <= 0 ||
                                        (balance && parseFloat(tipAmount) > parseFloat(balance.formatted))
                                    }
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isTipping ? 'Sending...' : 'Send Tip'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
