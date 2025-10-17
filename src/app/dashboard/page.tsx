'use client'

import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'
import { useConfideeContract, useGetLatestSecrets } from '@/hooks/useConfideeContract'

export default function DashboardPage() {
    const { address } = useAccount()
    const router = useRouter()
    const { createSecret, isWritePending, isConfirming, isConfirmed } = useConfideeContract()
    const { secrets, isLoading: secretsLoading, refetch } = useGetLatestSecrets(50)

    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [postContent, setPostContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    useEffect(() => {
        if (!address) {
            router.push('/')
        } else {
            // Show loading for smooth transition
            const timer = setTimeout(() => {
                setIsInitialLoading(false)
            }, 800)
            return () => clearTimeout(timer)
        }
    }, [address, router])

    useEffect(() => {
        if (isConfirmed && success) {
            // Refetch secrets after successful post
            refetch()
            setSuccess(false)
        }
    }, [isConfirmed, success, refetch])

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        if (!postContent.trim()) {
            setError('Please write something to share')
            setIsSubmitting(false)
            return
        }

        if (postContent.length > 1000) {
            setError('Post is too long (max 1000 characters)')
            setIsSubmitting(false)
            return
        }

        try {
            // Save to blockchain (plain text, no encryption)
            await createSecret(postContent)

            setSuccess(true)
            setPostContent('')
            setIsPostModalOpen(false)

            // Refetch secrets after a delay to ensure blockchain has processed
            setTimeout(() => {
                refetch()
            }, 3000)

        } catch (err) {
            console.error('Error creating post:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to create post'
            setError(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!address) {
        return null
    }

    // Show loading screen during initial load
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

                <section className="pb-12 sm:pb-20 px-20">
                    <div className="mx-auto">
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
            {isPostModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Share your thoughts</h2>
                            <button
                                onClick={() => setIsPostModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind? This will be visible to everyone on the blockchain..."
                                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                                disabled={isSubmitting}
                                maxLength={1000}
                            />

                            <div className="mt-2 text-right text-sm text-gray-500">
                                {postContent.length}/1000 characters
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
                                    onClick={() => setIsPostModalOpen(false)}
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
                    </div>
                </div>
            )}
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
        isActive: boolean
    },
    currentWallet: string
}) {
    const [isExpanded, setIsExpanded] = useState(false)

    const timeAgo = new Date(Number(secret.timestamp) * 1000).toLocaleString()
    const isOwnPost = secret.owner.toLowerCase() === currentWallet.toLowerCase()

    return (
        <div
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-start space-x-4">
                <div className={`${isOwnPost ? 'bg-blue-100' : 'bg-gray-100'} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-medium ${isOwnPost ? 'text-blue-600' : 'text-gray-600'}`}>
                        {isOwnPost ? 'YOU' : 'AU'}
                    </span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-sm font-medium ${isOwnPost ? 'text-blue-600' : 'text-gray-500'}`}>
                            {isOwnPost ? 'You' : 'Anonymous User'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{timeAgo}</span>
                    </div>

                    <div className="text-gray-900 mb-4 whitespace-pre-wrap">
                        {secret.content}
                    </div>

                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-3">
                                <div className="text-xs font-medium text-blue-900 mb-1">Blockchain Info</div>
                                <div className="text-xs text-blue-800 space-y-1">
                                    <div>Post ID: #{secret.id.toString()}</div>
                                    <div className="font-mono break-all">Owner: {secret.owner.slice(0, 6)}...{secret.owner.slice(-4)}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end text-xs">
                                <a
                                    href={`https://sepolia.basescan.org/address/0xcbc7049A98736d05dB5a927966F9E3ab3a393e90`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View on BaseScan →
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
