'use client'

import { useAccount } from 'wagmi'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'
import BaseModal from '@/components/BaseModal'
import TipModal from '@/components/TipModal'
import Toast from '@/components/Toast'
import PostCardSkeleton from '@/components/PostCardSkeleton'
import SessionModal from '@/components/SessionModal'
import { useConfideeContract, useGetAllSecrets, useGetTotalSecrets, useGetLikeCount, useHasUserLiked, useGetCommentCount, useGetTotalTips } from '@/hooks/useConfideeContract'
import { useToast } from '@/hooks/useToast'
import { useGaslessAction } from '@/hooks/useGaslessAction'
import { useSession } from '@/hooks/useSession'
import { formatDate } from '@/utils/dateFormatter'
import { getUserFriendlyError } from '@/utils/errorMessages'
import { DATA_FETCH, CONTENT_LIMITS, BLOCKCHAIN } from '@/constants/app'

export default function DashboardPage() {
    const { address, status } = useAccount()
    const router = useRouter()
    const { toast, success: showSuccess, error: showError, hideToast } = useToast()
    const { executeGaslessAction, isPending: isGaslessPending } = useGaslessAction()
    const { isCreatingSession, createSession, needsSession, setHasPrompted } = useSession()

    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [postContent, setPostContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Infinite scroll state
    const [page, setPage] = useState(0)
    const [refreshKey, setRefreshKey] = useState(0) // Force refresh trigger
    const [allSecrets, setAllSecrets] = useState<Array<{
        id: bigint;
        owner: string;
        content: string;
        timestamp: bigint;
        isActive: boolean;
        aiReply?: string;
        aiReplyTimestamp?: bigint;
        totalTips?: bigint;
    }>>([])
    const [hasMore, setHasMore] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const observerTarget = useRef<HTMLDivElement>(null)

    const { total: totalSecrets } = useGetTotalSecrets()
    const { secrets: currentPageSecrets, isLoading: secretsLoading, refetch } = useGetAllSecrets(
        page * DATA_FETCH.POSTS_PER_PAGE,
        DATA_FETCH.POSTS_PER_PAGE
    )

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Load secrets when currentPageSecrets changes
    useEffect(() => {
        if (!secretsLoading && currentPageSecrets) {
            if (currentPageSecrets.length > 0) {
                setAllSecrets(prev => {
                    // Deduplicate by id
                    const existingIds = new Set(prev.map(s => s.id.toString()))
                    const newSecrets = currentPageSecrets.filter(s => !existingIds.has(s.id.toString()))

                    // Only update if there are new secrets
                    if (newSecrets.length === 0) return prev
                    return [...prev, ...newSecrets]
                })

                // Check if we have more posts to load
                const loadedCount = (page + 1) * DATA_FETCH.POSTS_PER_PAGE
                setHasMore(loadedCount < totalSecrets)
            } else if (page === 0) {
                setAllSecrets([])
                setHasMore(false)
            }
            setIsLoadingMore(false)
        }
    }, [secretsLoading, currentPageSecrets, page, totalSecrets])

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !secretsLoading && !isLoadingMore) {
                    setIsLoadingMore(true)
                    setPage(prev => prev + 1)
                }
            },
            { threshold: 0.1 }
        )

        const currentTarget = observerTarget.current
        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget)
            }
        }
    }, [hasMore, secretsLoading, isLoadingMore])

    useEffect(() => {
        if (!isMounted) return

        const isStillReconnecting = status === 'connecting' || status === 'reconnecting'

        if (isStillReconnecting) {
            return
        }

        const checkAuthTimeout = setTimeout(() => {
            if (!address) {
                router.push('/')
            }
        }, 100)

        return () => clearTimeout(checkAuthTimeout)
    }, [address, router, status, isMounted])

    useEffect(() => {
        if (needsSession && isMounted) {
            setTimeout(() => {
                setIsSessionModalOpen(true)
            }, 500)
        }
    }, [needsSession, isMounted])

    const handleCreateSession = async () => {
        try {
            await createSession()
            setIsSessionModalOpen(false)
            showSuccess('Session created! You can now use gasless transactions 🎉')
        } catch (error) {
            console.error('Failed to create session:', error)
            showError('Failed to create session. Please try again.')
        }
    }

    const handleSkipSession = () => {
        setIsSessionModalOpen(false)
        setHasPrompted(true)
    }

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!postContent.trim()) {
            showError('Please write something to share')
            return
        }

        if (postContent.length > CONTENT_LIMITS.POST_MAX_LENGTH) {
            showError(`Post is too long (max ${CONTENT_LIMITS.POST_MAX_LENGTH} characters)`)
            return
        }

        setIsSubmitting(true)

        try {
            const result = await executeGaslessAction('post', { content: postContent })

            if (result.success) {
                showSuccess('Post successfully added to blockchain! 🎉')
                setPostContent('')
                setIsPostModalOpen(false)

                // Reset pagination to show new post immediately
                setTimeout(async () => {
                    setPage(0)
                    setAllSecrets([])
                    await refetch()
                }, DATA_FETCH.REFETCH_DELAY)

                // Trigger AI reply generation (non-blocking)
                if (result.secretId) {
                    // Don't use setTimeout, start immediately after post is confirmed
                    fetch('/api/ai-reply', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            postContent,
                            secretId: result.secretId
                        })
                    })
                        .then(async (aiResponse) => {
                            if (aiResponse.ok) {
                                console.log('✅ AI reply generated successfully')
                                // Wait for AI reply to be written to blockchain, then force full refresh
                                setTimeout(async () => {
                                    // Force complete refresh by resetting state
                                    setPage(0)
                                    setAllSecrets([])
                                    setRefreshKey(prev => prev + 1) // Trigger cache invalidation
                                    await refetch()
                                    console.log('🔄 Refetched posts to show AI reply')
                                }, 3000) // Wait 3s for blockchain confirmation
                            }
                        })
                        .catch((aiError) => {
                            console.error('AI reply generation failed:', aiError)
                            // Don't show error to user, AI reply is optional
                        })
                }
            }
        } catch (error) {
            console.error('Error creating post:', error)
            const errorMsg = getUserFriendlyError(error)
            showError(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isMounted || status === 'connecting' || status === 'reconnecting') {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
                <div className="relative text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                </div>
            </main>
        )
    }

    if (!address) {
        return null
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
                            disabled={isSubmitting || isGaslessPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg cursor-pointer"
                        >
                            {isSubmitting || isGaslessPending ? 'Posting...' : 'Share Your Thoughts'}
                        </button>

                    </div>
                </section>

                <section className="pb-12 sm:pb-20 px-4 sm:px-6 md:px-8 lg:px-20">
                    <div className="mx-auto max-w-7xl">
                        {page === 0 && secretsLoading ? (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                {[...Array(12)].map((_, i) => (
                                    <PostCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : allSecrets.length > 0 ? (
                            <>
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                    {allSecrets.map((secret) => (
                                        <PostCard
                                            key={secret.id.toString()}
                                            secret={secret}
                                            currentWallet={address || ''}
                                        />
                                    ))}
                                </div>

                                {/* Loading indicator for infinite scroll */}
                                {hasMore && (
                                    <div ref={observerTarget} className="mt-8 flex justify-center">
                                        {secretsLoading ? (
                                            <div className="flex items-center space-x-2 text-blue-600">
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                                                <span className="text-sm font-medium">Loading more posts...</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setIsLoadingMore(true)
                                                    setPage(prev => prev + 1)
                                                }}
                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:scale-105"
                                            >
                                                Load More
                                            </button>
                                        )}
                                    </div>
                                )}

                                {!hasMore && allSecrets.length > 0 && (
                                    <div className="mt-8 text-center">
                                        <p className="text-gray-500 text-sm">
                                            You&apos;ve reached the end! That&apos;s all the posts.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 sm:py-24 animate-fade-in">
                                <div className="rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
                                    <div className="mb-6 flex justify-center">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center animate-scale-up">
                                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                        No posts yet
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                        Be the first to share your thoughts anonymously on the blockchain!
                                    </p>
                                    <button
                                        onClick={() => setIsPostModalOpen(true)}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:scale-105"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create First Post
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Footer />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                    duration={toast.duration}
                />
            )}

            <BaseModal
                isOpen={isPostModalOpen}
                onClose={() => {
                    setIsPostModalOpen(false)
                    setPostContent('')
                }}
                title="Share your thoughts"
                maxWidth="2xl"
            >
                <form onSubmit={handlePostSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Thoughts <span className="text-gray-400">({postContent.length}/{CONTENT_LIMITS.POST_MAX_LENGTH})</span>
                    </label>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind? This will be visible to everyone on the blockchain..."
                        className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                        disabled={isSubmitting}
                        maxLength={CONTENT_LIMITS.POST_MAX_LENGTH}
                    />

                    <div className={`mt-1 text-right text-xs font-medium ${
                        postContent.length >= CONTENT_LIMITS.POST_MAX_LENGTH * CONTENT_LIMITS.DANGER_THRESHOLD
                            ? 'text-red-600'
                            : postContent.length >= CONTENT_LIMITS.POST_MAX_LENGTH * CONTENT_LIMITS.WARNING_THRESHOLD
                            ? 'text-yellow-600'
                            : 'text-gray-400'
                    }`}>
                        {postContent.length >= CONTENT_LIMITS.POST_MAX_LENGTH * CONTENT_LIMITS.WARNING_THRESHOLD && (
                            postContent.length >= CONTENT_LIMITS.POST_MAX_LENGTH * CONTENT_LIMITS.DANGER_THRESHOLD
                                ? '⚠️ Nearly at limit!'
                                : '⚠️ Approaching limit'
                        )}
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
                                setPostContent('')
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
                            {isSubmitting ? 'Signing...' : 'Post'}
                        </button>
                    </div>
                </form>
            </BaseModal>

            <SessionModal
                isOpen={isSessionModalOpen}
                onClose={handleSkipSession}
                onCreateSession={handleCreateSession}
                isCreating={isCreatingSession}
            />
        </main>
    )
}

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
    const [showHeartPop, setShowHeartPop] = useState(false)
    const { toast: cardToast, error: showCardError, hideToast: hideCardToast } = useToast()

    const { tipPost } = useConfideeContract()
    const { executeGaslessAction, isPending: isGaslessPending } = useGaslessAction()
    const { likeCount: initialLikeCount, refetch: refetchLikes } = useGetLikeCount(secret.id)
    const { hasLiked: initialHasLiked, refetch: refetchHasLiked } = useHasUserLiked(secret.id, currentWallet as `0x${string}`)
    const { commentCount } = useGetCommentCount(secret.id)
    const { totalTips, refetch: refetchTips } = useGetTotalTips(secret.id)

    const [isLiked, setIsLiked] = useState(initialHasLiked === true)
    const [likeCount, setLikeCount] = useState(initialLikeCount || 0)

    useEffect(() => {
        setIsLiked(initialHasLiked === true)
    }, [initialHasLiked])

    useEffect(() => {
        setLikeCount(initialLikeCount || 0)
    }, [initialLikeCount])

    const timeAgo = formatDate(new Date(Number(secret.timestamp) * 1000))
    const isOwnPost = secret.owner.toLowerCase() === currentWallet.toLowerCase()

    const handleCardClick = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(`post_${secret.id}`, JSON.stringify({
                secret: {
                    id: secret.id.toString(),
                    owner: secret.owner,
                    content: secret.content,
                    timestamp: secret.timestamp.toString(),
                    isActive: secret.isActive,
                    aiReply: secret.aiReply,
                    aiReplyTimestamp: secret.aiReplyTimestamp?.toString()
                },
                likeCount: initialLikeCount,
                hasLiked: initialHasLiked,
                commentCount,
                totalTips: totalTips?.toString()
            }))
        }
        router.push(`/post/${secret.id}`)
    }

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()

        setShowHeartPop(true)
        setTimeout(() => setShowHeartPop(false), 300)

        const wasLiked = isLiked
        const prevCount = likeCount

        setIsLiked(!wasLiked)
        setLikeCount(prevCount + (wasLiked ? -1 : 1))

        try {
            const action = wasLiked ? 'unlike' : 'like'
            const result = await executeGaslessAction(action, { secretId: secret.id })

            if (result.success) {
                setTimeout(() => {
                    refetchLikes()
                    refetchHasLiked()
                }, DATA_FETCH.REFETCH_DELAY)
            }
        } catch (error) {
            setIsLiked(wasLiked)
            setLikeCount(prevCount)
            console.error('Error toggling like:', error)
            const errorMsg = getUserFriendlyError(error)
            showCardError(errorMsg)
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
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 transition-all duration-200 cursor-pointer"
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
                                    disabled={isGaslessPending}
                                    className={`flex items-center space-x-1 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-red-600'
                                    }`}
                                >
                                    <svg
                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${showHeartPop ? 'animate-heart-pop' : ''}`}
                                        fill={isLiked ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="text-xs sm:text-sm font-medium">{likeCount}</span>
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

            {cardToast && (
                <Toast
                    message={cardToast.message}
                    type={cardToast.type}
                    onClose={hideCardToast}
                    duration={cardToast.duration}
                />
            )}

            <TipModal
                isOpen={showTipModal}
                onClose={() => setShowTipModal(false)}
                onSubmit={handleTipSubmit}
                currentWallet={currentWallet}
            />
        </>
    )
}
