'use client'

import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'
import BaseModal from '@/components/BaseModal'
import TipModal from '@/components/TipModal'
import { useConfideeContract, useGetLatestSecrets, useGetLikeCount, useHasUserLiked, useGetCommentCount, useGetTotalTips } from '@/hooks/useConfideeContract'
import { usePostForm } from '@/hooks/usePostForm'
import { formatDate } from '@/utils/dateFormatter'
import { getUserFriendlyError } from '@/utils/errorMessages'
import { DATA_FETCH, CONTENT_LIMITS, UI_TIMEOUTS, BLOCKCHAIN } from '@/constants/app'

export default function DashboardPage() {
    const { address } = useAccount()
    const router = useRouter()
    const { isWritePending, isConfirming, isConfirmed } = useConfideeContract()
    const { secrets, isLoading: secretsLoading, refetch } = useGetLatestSecrets(DATA_FETCH.LATEST_SECRETS_LIMIT)

    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    const {
        postContent,
        setPostContent,
        isSubmitting,
        error,
        setError,
        success,
        setSuccess,
        handleSubmit: submitPost,
        resetForm
    } = usePostForm()

    useEffect(() => {
        if (!address) {
            router.push('/')
        } else {
            const timer = setTimeout(() => {
                setIsInitialLoading(false)
            }, UI_TIMEOUTS.LOADING_DELAY)
            return () => clearTimeout(timer)
        }
    }, [address, router])

    useEffect(() => {
        if (isConfirmed && success) {
            refetch()
            setSuccess(false)
        }
    }, [isConfirmed, success, refetch, setSuccess])

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        await submitPost((newSecretId, savedContent) => {
            setIsPostModalOpen(false)

            // Trigger AI reply in background
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

                setTimeout(() => refetch(), DATA_FETCH.REFETCH_DELAY)
            }, DATA_FETCH.AI_REPLY_DELAY)
        })
    }

    if (!address) {
        return null
    }

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
            <BaseModal
                isOpen={isPostModalOpen}
                onClose={() => {
                    setIsPostModalOpen(false)
                    resetForm()
                }}
                title="Share your thoughts"
                maxWidth="2xl"
            >
                <form onSubmit={handlePostSubmit}>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind? This will be visible to everyone on the blockchain..."
                        className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                        disabled={isSubmitting}
                        maxLength={CONTENT_LIMITS.POST_MAX_LENGTH}
                    />

                    <div className="mt-2 text-right text-sm text-gray-500">
                        {postContent.length}/{CONTENT_LIMITS.POST_MAX_LENGTH} characters
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
                            onClick={() => {
                                setIsPostModalOpen(false)
                                resetForm()
                            }}
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
            </BaseModal>
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
    const [error, setError] = useState('')

    const { likeSecret, unlikeSecret, tipPost } = useConfideeContract()
    const { likeCount, refetch: refetchLikes } = useGetLikeCount(secret.id)
    const { hasLiked, refetch: refetchHasLiked } = useHasUserLiked(secret.id, currentWallet as `0x${string}`)
    const { commentCount } = useGetCommentCount(secret.id)
    const { totalTips, refetch: refetchTips } = useGetTotalTips(secret.id)

    const timeAgo = formatDate(new Date(Number(secret.timestamp) * 1000))
    const isOwnPost = secret.owner.toLowerCase() === currentWallet.toLowerCase()

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
            setTimeout(() => {
                refetchLikes()
                refetchHasLiked()
            }, DATA_FETCH.REFETCH_DELAY)
        } catch (error) {
            console.error('Error toggling like:', error)
            const errorMsg = getUserFriendlyError(error)
            setError(errorMsg)
            setTimeout(() => setError(''), UI_TIMEOUTS.ERROR_MESSAGE)
        }
    }

    const handleTipSubmit = async (amount: string) => {
        await tipPost(secret.id, amount)
        setTimeout(() => {
            refetchTips()
        }, DATA_FETCH.REFETCH_DELAY)
    }

    return (
        <>
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

                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <a
                                href={BLOCKCHAIN.getContractUrl()}
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
            </div>

            {/* Tip Modal */}
            <TipModal
                isOpen={showTipModal}
                onClose={() => setShowTipModal(false)}
                onSubmit={handleTipSubmit}
                currentWallet={currentWallet}
            />
        </>
    )
}
