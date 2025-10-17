'use client'

import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import PostCard from '@/components/PostCard'
import Footer from '@/components/Footer'
import { useConfideeContract, useGetLatestSecrets, useGetSecretComments, useGetLikeCount, useHasUserLiked, useGetTotalTips } from '@/hooks/useConfideeContract'

export default function PostDetailPage() {
    const { address } = useAccount()
    const { data: balance } = useBalance({
        address: address,
    })
    const router = useRouter()
    const params = useParams()
    const postId = params.id as string

    const { secrets, isLoading: secretsLoading } = useGetLatestSecrets(50)
    const { likeSecret, unlikeSecret, createComment, tipPost } = useConfideeContract()

    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
    const [isTipModalOpen, setIsTipModalOpen] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const [tipAmount, setTipAmount] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!address) {
            router.push('/')
        }
    }, [address, router])

    // Find the specific post
    const post = secrets.find(s => s.id.toString() === postId)

    // Fetch additional data for this specific post
    const { comments, refetch: refetchComments } = useGetSecretComments(post?.id || BigInt(0))
    const { likeCount, refetch: refetchLikes } = useGetLikeCount(post?.id || BigInt(0))
    const { hasLiked, refetch: refetchHasLiked } = useHasUserLiked(post?.id || BigInt(0), address as `0x${string}`)
    const { totalTips, refetch: refetchTips } = useGetTotalTips(post?.id || BigInt(0))

    if (secretsLoading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
                <div className="relative text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-6"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading post...</h2>
                </div>
            </main>
        )
    }

    if (!post) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
                <div className="relative text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to Feed
                    </Link>
                </div>
            </main>
        )
    }

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

    const handleLike = async () => {
        setError('')
        try {
            if (hasLiked) {
                await unlikeSecret(post.id)
            } else {
                await likeSecret(post.id)
            }
            setTimeout(() => {
                refetchLikes()
                refetchHasLiked()
            }, 1000)
        } catch (err) {
            console.error('Error liking post:', err)
            const errorMsg = getUserFriendlyError(err)
            setError(errorMsg)
            // Auto-dismiss error after 5 seconds
            setTimeout(() => setError(''), 5000)
        }
    }

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentContent.trim()) return

        setIsSubmitting(true)
        setError('')

        try {
            await createComment(post.id, commentContent)
            setCommentContent('')
            setIsCommentModalOpen(false)
            setTimeout(() => refetchComments(), 1000)
        } catch (err) {
            console.error('Error commenting:', err)
            setError(getUserFriendlyError(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTip = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tipAmount || parseFloat(tipAmount) <= 0) return

        setIsSubmitting(true)
        setError('')

        try {
            await tipPost(post.id, tipAmount)
            setTipAmount('')
            setIsTipModalOpen(false)
            setTimeout(() => refetchTips(), 1000)
        } catch (err) {
            console.error('Error tipping:', err)
            setError(getUserFriendlyError(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
            <div className="relative flex-1">
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="font-medium">Back to Feed</span>
                            </Link>
                            <WalletButton />
                        </div>
                    </div>
                </nav>

                {/* Toast Error Notification */}
                {error && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-fade-in">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-lg">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                                <button
                                    onClick={() => setError('')}
                                    className="ml-3 text-red-400 hover:text-red-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <PostCard
                            id={post.id.toString()}
                            content={post.content}
                            timestamp={new Date(Number(post.timestamp) * 1000)}
                            wallet={post.owner}
                            likes={hasLiked ? [address || ''] : []}
                            likeCount={likeCount || 0}
                            totalTips={Number(totalTips || BigInt(0))}
                            currentUserWallet={address || ''}
                            aiResponse={(post as unknown as { aiReply?: string; aiReplyTimestamp?: bigint }).aiReply ? {
                                content: (post as unknown as { aiReply: string }).aiReply,
                                timestamp: new Date(Number((post as unknown as { aiReplyTimestamp?: bigint }).aiReplyTimestamp || 0) * 1000)
                            } : undefined}
                            replies={(comments || []).map(comment => ({
                                id: comment.id.toString(),
                                content: comment.content,
                                timestamp: new Date(Number(comment.timestamp) * 1000),
                                wallet: comment.author
                            }))}
                            onReply={() => setIsCommentModalOpen(true)}
                            onLike={handleLike}
                            isDetailView={true}
                        />

                        {/* Action Buttons */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsCommentModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Add Comment</span>
                            </button>
                            <button
                                onClick={() => setIsTipModalOpen(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Send Tip</span>
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>

            {/* Comment Modal */}
            {isCommentModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add Comment</h3>
                            <button
                                onClick={() => setIsCommentModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleComment}>
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Share your supportive thoughts..."
                                className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-900 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                maxLength={500}
                            />
                            <div className="text-xs sm:text-sm text-gray-500 mb-4">{commentContent.length}/500</div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCommentModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!commentContent.trim() || isSubmitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold disabled:bg-gray-400 transition-colors"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tip Modal */}
            {isTipModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Send Tip</h3>
                            <button
                                onClick={() => setIsTipModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleTip}>
                            {/* Balance Display */}
                            {balance && (
                                <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="text-xs sm:text-sm font-medium text-blue-900">Your Balance</span>
                                        </div>
                                        <span className="text-base sm:text-lg font-bold text-blue-900">
                                            {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Amount (ETH)</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    min="0"
                                    value={tipAmount}
                                    onChange={(e) => setTipAmount(e.target.value)}
                                    placeholder="0.001"
                                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />

                                {/* Insufficient Balance Warning */}
                                {tipAmount && balance && parseFloat(tipAmount) > parseFloat(balance.formatted) && (
                                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-xs sm:text-sm text-red-700">
                                            Insufficient balance! You only have {parseFloat(balance.formatted).toFixed(4)} ETH
                                        </p>
                                    </div>
                                )}
                                {tipAmount && parseFloat(tipAmount) > 0 && (
                                    <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                                        <div className="text-xs sm:text-sm text-gray-700 space-y-2">
                                            <div className="flex justify-between">
                                                <span>Amount:</span>
                                                <span className="font-semibold">{tipAmount} ETH</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Platform Fee (5%):</span>
                                                <span className="text-gray-600">{(parseFloat(tipAmount) * 0.05).toFixed(6)} ETH</span>
                                            </div>
                                            <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                                                <span className="font-semibold">Recipient Gets:</span>
                                                <span className="font-bold text-green-700">
                                                    {(parseFloat(tipAmount) * 0.95).toFixed(6)} ETH
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsTipModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        !tipAmount ||
                                        parseFloat(tipAmount) <= 0 ||
                                        isSubmitting ||
                                        (balance && parseFloat(tipAmount) > parseFloat(balance.formatted))
                                    }
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Tip'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}
