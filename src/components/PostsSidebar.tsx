'use client'

import { Post } from '@/utils/posts'

interface PostsSidebarProps {
    posts: Post[]
    currentPostId: string
    onPostClick: (postId: string) => void
}

export default function PostsSidebar({ posts, currentPostId, onPostClick }: PostsSidebarProps) {
    const otherPosts = posts.filter(post => post.id !== currentPostId)

    if (otherPosts.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Posts</h3>
                <div className="text-center text-gray-500 py-8">
                    No other posts yet. Create the first one!
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Posts</h3>
            <div className="space-y-3 max-h-screen overflow-y-auto">
                {otherPosts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => onPostClick(post.id)}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-gray-600">AU</span>
                            </div>
                            <span className="text-xs text-gray-500 truncate">
                                {post.timestamp.toLocaleDateString()}
                            </span>
                        </div>

                        <div className="text-sm text-gray-900 line-clamp-3 mb-3">
                            {post.content}
                        </div>

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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}