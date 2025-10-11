'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import { saveLike, removeLike, hasUserLiked, getLikeData } from '@/utils/likes'
import { getPostById, updatePost, addReplyToPost, getPosts, Post } from '@/utils/posts'
import PostsSidebar from '@/components/PostsSidebar'
import Footer from '@/components/Footer'

export default function PostDetailPage() {
    const { address } = useAccount()
    const router = useRouter()
    const params = useParams()
    const postId = params?.id as string

    const [post, setPost] = useState<Post | null>(null)
    const [allPosts, setAllPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [sidebarLoading, setSidebarLoading] = useState(false)
    const [replyContent, setReplyContent] = useState('')

    useEffect(() => {
        if (!address) {
            router.push('/')
            return
        }

        const storedPosts = getPosts()
        setAllPosts(storedPosts)

        if (postId) {
            const foundPost = getPostById(postId)
            if (foundPost) {
                const { likes, likeCount } = getLikeData(postId)
                setPost({
                    ...foundPost,
                    likes,
                    likeCount
                })
            }
            setLoading(false)
            setSidebarLoading(false)
        }
    }, [address, router, postId])

    const handleLike = () => {
        if (!address || !post) return

        const walletAddress = address
        const userHasLiked = hasUserLiked(post.id, walletAddress)

        if (userHasLiked) {
            removeLike(post.id, walletAddress)
        } else {
            saveLike(post.id, walletAddress)
        }

        const { likes, likeCount } = getLikeData(post.id)

        setPost(prev => prev ? {
            ...prev,
            likes,
            likeCount
        } : null)

        updatePost(post.id, { likes, likeCount })
    }

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!address || !post || !replyContent.trim()) return

        const newReply = {
            id: Date.now().toString(),
            content: replyContent.trim(),
            timestamp: new Date(),
            wallet: address
        }

        addReplyToPost(post.id, newReply)

        setPost(prev => prev ? {
            ...prev,
            replies: [...prev.replies, newReply]
        } : null)

        setReplyContent('')
    }

    const handleSidebarPostClick = (selectedPostId: string) => {
        setSidebarLoading(true)

        setTimeout(() => {
            router.push(`/post/${selectedPostId}`)
        }, 200)

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!address) {
        return null
    }

    if (loading) {
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
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="text-gray-500">Loading post...</div>
                        </div>
                    </section>
                </div>
                <Footer />
            </main>
        )
    }

    if (!post) {
        return (
            <main className="min-h-screen bg-white flex flex-col">
                <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
                <div className="relative flex-1">
                    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center justify-between">
                                <Link href="/dashboard" className="text-xl sm:text-2xl font-bold text-gray-900">
                                    Confidee
                                </Link>
                                <WalletButton />
                            </div>
                        </div>
                    </nav>

                    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Post not found
                            </h1>
                            <p className="text-gray-600 mb-8">
                                This post might have been deleted or the link is incorrect.
                            </p>
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </section>
                </div>
                <Footer />
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
                            <Link href="/dashboard" className="text-xl sm:text-2xl font-bold text-gray-900">
                                Confidee
                            </Link>
                            <WalletButton />
                        </div>
                    </div>
                </nav>

                <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Back to Dashboard</span>
                            </Link>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:gap-6 justify-between">
                            <div className="flex-1 lg:max-w-3xl mb-8 lg:mb-0">
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm mb-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-gray-600">AU</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Anonymous User
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-sm text-gray-500">
                                                    {post.timestamp.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-gray-900 text-base sm:text-lg leading-relaxed mb-6">
                                                {post.content}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500">
                                                <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                    {`${post.wallet.slice(0, 4)}...${post.wallet.slice(-4)}`}
                                                </span>

                                                <button
                                                    onClick={handleLike}
                                                    className={`flex items-center space-x-1 transition-all duration-150 ease-out hover:scale-105 active:scale-110 ${post.likes.includes(address || '')
                                                        ? 'text-red-600 hover:text-red-700'
                                                        : 'text-gray-500 hover:text-red-600'
                                                        }`}
                                                >
                                                    <svg className="w-4 h-4 transition-transform duration-150 ease-out"
                                                        fill={post.likes.includes(address || '') ? "currentColor" : "none"}
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span className="transition-all duration-150 ease-out">{post.likeCount}</span>
                                                </button>

                                                <div className="flex items-center space-x-1 text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    <span>{post.replies.length}</span>
                                                </div>

                                                <div className="flex items-center space-x-1 text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{post.totalTips} ETH</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {post.aiResponse && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-blue-900">AI Response</span>
                                            <span className="text-blue-300">•</span>
                                            <span className="text-sm text-blue-700">
                                                {post.aiResponse.timestamp.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-blue-800 leading-relaxed">
                                            {post.aiResponse.content}
                                        </div>
                                    </div>
                                )}

                                {post.replies.length > 0 && (
                                    <div className="space-y-4 mb-6">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                            Replies ({post.replies.length})
                                        </h3>
                                        {post.replies.map((reply) => (
                                            <div key={reply.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        Anonymous User
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-sm text-gray-500">
                                                        {reply.timestamp.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="text-gray-800">
                                                    {reply.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Add your reply</h3>
                                    <form onSubmit={handleReplySubmit}>
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write your supportive reply..."
                                            className="w-full h-24 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            maxLength={300}
                                        />

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-4">
                                            <span className="text-sm text-gray-500">
                                                {replyContent.length}/300 characters
                                            </span>

                                            <button
                                                type="submit"
                                                disabled={!replyContent.trim()}
                                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="lg:w-80 lg:flex-shrink-0">
                                <PostsSidebar
                                    posts={allPosts}
                                    currentPostId={post.id}
                                    onPostClick={handleSidebarPostClick}
                                    loading={sidebarLoading}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}