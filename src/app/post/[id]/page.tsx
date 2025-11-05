'use client'

import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import PostCard from '@/components/PostCard'
import Footer from '@/components/Footer'
import CommentModal from '@/components/CommentModal'
import TipModal from '@/components/TipModal'
import { useConfideeContract, useGetSecret, useGetSecretComments, useGetLikeCount, useHasUserLiked, useGetTotalTips } from '@/hooks/useConfideeContract'
import { DATA_FETCH, UI_TIMEOUTS, ROUTES } from '@/constants/app'

export default function PostDetailPage() {
    const { address } = useAccount()
    const router = useRouter()
    const params = useParams()
    const postId = BigInt(params.id as string)

    const { likeSecret, unlikeSecret, createComment, tipPost } = useConfideeContract()

    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
    const [isTipModalOpen, setIsTipModalOpen] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!address) {
            router.push(ROUTES.HOME)
        }
    }, [address, router])

    // Fetch the specific post directly by ID
    const { secret: post, isLoading: postLoading } = useGetSecret(postId)

    // Fetch additional data for this specific post
    const { comments, refetch: refetchComments } = useGetSecretComments(postId)
    const { likeCount, refetch: refetchLikes } = useGetLikeCount(postId)
    const { hasLiked, refetch: refetchHasLiked } = useHasUserLiked(postId, address as `0x${string}`)
    const { totalTips, refetch: refetchTips } = useGetTotalTips(postId)

    if (postLoading) {
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
                    <Link href={ROUTES.DASHBOARD} className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to Feed
                    </Link>
                </div>
            </main>
        )
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
            }, DATA_FETCH.TX_POLL_INTERVAL)
        } catch (err) {
            console.error('Error liking post:', err)
            setError(err instanceof Error ? err.message : 'Failed to like post')
            setTimeout(() => setError(''), UI_TIMEOUTS.ERROR_MESSAGE)
        }
    }

    const handleCommentSubmit = async (content: string) => {
        await createComment(post.id, content)
        setTimeout(() => refetchComments(), DATA_FETCH.TX_POLL_INTERVAL)
    }

    const handleTipSubmit = async (amount: string) => {
        await tipPost(post.id, amount)
        setTimeout(() => refetchTips(), DATA_FETCH.TX_POLL_INTERVAL)
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
            <div className="relative flex-1">
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <Link href={ROUTES.DASHBOARD} className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
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
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                onSubmit={handleCommentSubmit}
            />

            {/* Tip Modal */}
            <TipModal
                isOpen={isTipModalOpen}
                onClose={() => setIsTipModalOpen(false)}
                onSubmit={handleTipSubmit}
                currentWallet={address || ''}
            />
        </main>
    )
}
