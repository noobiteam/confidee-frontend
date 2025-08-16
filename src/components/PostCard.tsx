'use client'

import { getUsername } from '@/utils/username'

interface PostCardProps {
    id: string
    content: string
    timestamp: Date
    wallet: string
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
}

export default function PostCard({ id, content, timestamp, wallet, aiResponse, replies, onReply }: PostCardProps) {
    const shortWallet = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
    const timeAgo = new Date(timestamp).toLocaleString()
    const username = getUsername(wallet)
    const displayName = username || 'Anonymous User'

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
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
                            <div className="text-blue-800">
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

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{shortWallet}</span>
                        <button
                            onClick={() => onReply(id)}
                            className="hover:text-blue-600 transition-colors"
                        >
                            Reply
                        </button>
                        <button className="hover:text-green-600 transition-colors">Tip</button>
                    </div>
                </div>
            </div>
        </div>
    )
}