'use client'

import { useRouter } from 'next/navigation'

interface PostCardProps {
    id: string
    content: string
    timestamp: Date
    wallet: string
    likes: string[]
    likeCount: number
    totalTips: number
    currentUserWallet: string
    aiResponse?: {
        content: string
        timestamp: Date
    }
    replies: Array<{
        id: string
        content: string
        timestamp: Date
        wallet: string
    }>
    onReply: (postId: string) => void
    onLike: (postId: string) => void
    isDetailView?: boolean  // NEW: flag untuk detect if in detail page
}

export default function PostCard({ id, content, timestamp, wallet, likes, likeCount, totalTips, currentUserWallet, aiResponse, replies, onReply, onLike, isDetailView = false }: PostCardProps) {
    const router = useRouter()
    const shortWallet = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
    const timeAgo = new Date(timestamp).toLocaleString()
    const hasUserLiked = likes ? likes.includes(currentUserWallet) : false

    const handleCardClick = () => {
        // Kalo bukan detail view, go to detail page
        if (!isDetailView) {
            router.push(`/post/${id}`)
        }
    }

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation()
        action()
    }

    return (
        <div
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
            onClick={handleCardClick}
        >
            <div className="flex items-start space-x-4">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">AU</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Anonymous User</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{timeAgo}</span>
                    </div>
                    <div className="text-gray-900 mb-4">
                        {content}
                    </div>

                    {/* AI Response - Always show if available */}
                    {aiResponse && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" />
                                </svg>
                                <span className="text-sm font-semibold text-blue-900">AI Support Response</span>
                                <span className="text-blue-300">•</span>
                                <span className="text-xs text-blue-700">{new Date(aiResponse.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-blue-900 leading-relaxed">
                                {aiResponse.content}
                            </div>
                        </div>
                    )}

                    {/* User Comments - Only show in detail view */}
                    {isDetailView && replies && replies.length > 0 && (
                        <div className="space-y-3 mb-4">
                            <div className="text-sm font-semibold text-gray-700 mb-2">Community Comments ({replies.length})</div>
                            {replies.map((reply) => (
                                <div key={reply.id} className="bg-gray-50 p-3 rounded-lg ml-4 border border-gray-100">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xs font-medium text-gray-500">Anonymous User</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-800">{reply.content}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Show "View Details" button in feed view if there are comments */}
                    {!isDetailView && replies && replies.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/post/${id}`)
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center space-x-1"
                        >
                            <span>View {replies.length} {replies.length === 1 ? 'comment' : 'comments'}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">{shortWallet}</span>

                            <button
                                onClick={(e) => handleActionClick(e, () => onLike(id))}
                                className={`flex items-center space-x-1 hover:scale-105 transition-all ${hasUserLiked
                                    ? 'text-red-600 hover:text-red-700'
                                    : 'text-gray-500 hover:text-red-600'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill={hasUserLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{likeCount}</span>
                            </button>

                            <button
                                onClick={(e) => handleActionClick(e, () => onReply(id))}
                                className="flex items-center space-x-1 hover:text-blue-600 hover:scale-105 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{replies ? replies.length : 0}</span>
                            </button>

                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{totalTips} ETH</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}