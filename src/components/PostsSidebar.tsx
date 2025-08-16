'use client'

import { useState } from 'react'
import { Post } from '@/utils/posts'

interface PostsSidebarProps {
    posts: Post[]
    currentPostId: string
    onPostClick: (postId: string) => void
    loading?: boolean
}

export default function PostsSidebar({ posts, currentPostId, onPostClick, loading }: PostsSidebarProps) {
    const [clickedPostId, setClickedPostId] = useState<string | null>(null)
    const otherPosts = posts.filter(post => post.id !== currentPostId)

    const handlePostClick = (postId: string) => {
        setClickedPostId(postId)
        onPostClick(postId)
    }

    if (otherPosts.length === 0) {
        return (
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Posts</h3>
                <div className="text-center text-gray-500 py-8">
                    No other posts yet. Create the first one!
                </div>
            </div>
        )
    }

    return (
        <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Posts</h3>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {loading && (
                    <div className="text-center text-gray-500 py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                )}
                {otherPosts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => handlePostClick(post.id)}
                        className={`border border-gray-200 rounded-xl p-4 cursor-pointer transition-all ${clickedPostId === post.id
                            ? 'border-blue-400 bg-blue-100 opacity-75'
                            : 'hover:border-blue-300 hover:bg-blue-50'
                            }`}
                    >
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-gray-600">AU</span>
                            </div>
                            <span className="text-xs font-medium text-gray-500 truncate">
                                Anonymous User
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400 truncate">
                                {post.timestamp.toLocaleDateString()}
                            </span>
                        </div>

                        <div className="text-sm text-gray-900 mb-3" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {post.content}
                        </div>

                        {post.aiResponse && (
                            <div className="bg-blue-50 rounded-lg p-2 mb-3">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <span className="text-xs font-medium text-blue-700">AI replied</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{post.likeCount}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{post.replies.length}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{post.totalTips} SOL</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}