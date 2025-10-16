'use client'

import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'
import { useConfideeContract, useGetMySecrets, useGetSecret } from '@/hooks/useConfideeContract'
import { encryptData, decryptData, generateEncryptionKey } from '@/utils/encryption'

export default function DashboardPage() {
    const { address } = useAccount()
    const router = useRouter()
    const { createSecret, isWritePending, isConfirming, isConfirmed } = useConfideeContract()
    const { secretIds, isLoading: secretsLoading, refetch } = useGetMySecrets()

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

        try {
            // Generate encryption key (stored in localStorage for this demo)
            const encryptionKey = generateEncryptionKey()

            // Create post object with metadata
            const postData = {
                content: postContent,
                timestamp: new Date().toISOString(),
                wallet: address,
            }

            // Encrypt the entire post
            const encryptedData = encryptData(JSON.stringify(postData), encryptionKey)

            // Save to blockchain
            await createSecret(encryptedData)

            // Store encryption key in localStorage (in production, use better key management)
            const keys = JSON.parse(localStorage.getItem('confidee_keys') || '{}')
            keys[`secret_${Date.now()}`] = encryptionKey
            localStorage.setItem('confidee_keys', JSON.stringify(keys))

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
                            Welcome to your safe space
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
                            Share whatever&apos;s on your heart, stored securely on blockchain
                        </p>

                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            disabled={isWritePending || isConfirming}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors disabled:bg-gray-400"
                        >
                            {isWritePending || isConfirming ? 'Posting...' : 'Ready to share?'}
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
                                <p className="text-gray-600">Loading your posts from blockchain...</p>
                            </div>
                        ) : secretIds.length > 0 ? (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                {secretIds.map((secretId) => (
                                    <div
                                        key={secretId.toString()}
                                        className={secretIds.length === 1 ? 'md:col-start-2' : ''}
                                    >
                                        <PostCardBlockchain
                                            secretId={secretId}
                                            currentWallet={address || ''}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="rounded-2xl p-8 sm:p-12">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        Your space is ready for your first thought
                                    </h3>
                                    <p className="text-gray-600">
                                        This is where your story begins
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Footer />

            {/* Create Post Modal - Matching original design */}
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
                                placeholder="What's on your mind? Your post will be encrypted and stored on blockchain..."
                                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                                disabled={isSubmitting}
                            />

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
                                <p className="font-semibold mb-1">🔐 Blockchain powered</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Encrypted before storing on Base Sepolia</li>
                                    <li>Permanent and censorship-resistant</li>
                                    <li>Only you can decrypt and view</li>
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

// Component untuk render individual post - matching PostCard design
function PostCardBlockchain({ secretId, currentWallet }: { secretId: bigint, currentWallet: string }) {
    const { secret, isLoading } = useGetSecret(secretId)
    const [decryptedPost, setDecryptedPost] = useState<{ content: string; timestamp: string; wallet: string } | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (secret && !decryptedPost) {
            try {
                const keys = JSON.parse(localStorage.getItem('confidee_keys') || '{}')
                const keyArray = Object.values(keys)

                if (keyArray.length === 0) {
                    // No keys available
                    return
                }

                for (const key of keyArray) {
                    try {
                        const decrypted = decryptData(secret.encryptedData, key as string)
                        const postData = JSON.parse(decrypted)
                        setDecryptedPost(postData)
                        break
                    } catch (decryptErr) {
                        // Silently continue to next key
                        continue
                    }
                }
            } catch (err) {
                // Silent fail - post will show as encrypted
                console.warn('Unable to decrypt secret:', secretId.toString())
            }
        }
    }, [secret, decryptedPost, secretId])

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        )
    }

    if (!secret) return null

    const timeAgo = new Date(Number(secret.timestamp) * 1000).toLocaleString()

    return (
        <div
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
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

                    {decryptedPost ? (
                        <div className="text-gray-900 mb-4">
                            {decryptedPost.content}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm mb-4">
                            🔐 Encrypted on blockchain
                        </div>
                    )}

                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-3">
                                <div className="text-xs font-medium text-blue-900 mb-1">On-chain Data</div>
                                <div className="text-xs text-blue-800 font-mono break-all">
                                    {secret.encryptedData.slice(0, 80)}...
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Secret #{secretId.toString()}</span>
                                <a
                                    href={`https://sepolia.basescan.org/address/0xAA095A42912333B4888269CCdE1286E02609493f`}
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

                    {!decryptedPost && (
                        <div className="text-xs text-gray-400 mt-2">
                            Unable to decrypt - key not found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
