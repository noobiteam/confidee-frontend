'use client'

import { getUsername } from '@/utils/username'

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
}

export default function PostCard({ id, content, timestamp, wallet, likes, likeCount, totalTips, currentUserWallet, aiResponse, replies, onReply, onLike }: PostCardProps) {
    const shortWallet = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
    const timeAgo = new Date(timestamp).toLocaleString()
    const username = getUsername(wallet)
    const displayName = username || 'Anonymous User'
    const hasUserLiked = likes.includes(currentUserWallet)

    const handleCardClick = () => {
        onReply(id)
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
                        <span className="text-sm font-medium text-gray-500">{displayName}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{timeAgo}</span>
                    </div>
                    <div className="text-gray-900 mb-4">
                        {content}
                    </div>

                    {aiResponse && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-blue-900">AI Response</span>
                                <span className="text-blue-300">•</span>
                                <span className="text-sm text-blue-700">{new Date(aiResponse.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-blue-800">
                                {aiResponse.content}
                            </div>
                        </div>
                    )}

                    {replies.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {replies.map((reply) => {
                                const replyUsername = getUsername(reply.wallet)
                                const replyDisplayName = replyUsername || 'Anonymous User'

                                return (
                                    <div key={reply.id} className="bg-gray-50 p-3 rounded-lg ml-4">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-xs font-medium text-gray-500">{replyDisplayName}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className="text-sm text-gray-800">{reply.content}</div>
                                    </div>
                                )
                            })}
                        </div>
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
                                <span>{replies.length}</span>
                            </button>

                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{totalTips} SOL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}