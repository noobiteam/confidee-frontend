'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WalletButton from '@/components/WalletButton'
import CreatePostModal from '@/components/CreatePostModal'

export default function DashboardPage() {
    const { publicKey } = useWallet()
    const router = useRouter()
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [posts, setPosts] = useState<Array<{ id: string, content: string, timestamp: Date, wallet: string }>>([])

    useEffect(() => {
        if (!publicKey) {
            router.push('/')
        }
    }, [publicKey, router])

    const handlePostSubmit = (content: string) => {
        const newPost = {
            id: Date.now().toString(),
            content,
            timestamp: new Date(),
            wallet: publicKey?.toString() || ''
        }
        setPosts(prev => [newPost, ...prev])
    }

    if (!publicKey) {
        return null
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
            <div className="relative">
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                                Confidee
                            </div>
                            <WalletButton />
                        </div>
                    </div>
                </nav>

                <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Welcome to your dashboard
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
                            Share your thoughts anonymously and connect with the community.
                        </p>

                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors"
                        >
                            Share Your Thoughts
                        </button>
                    </div>
                </section>
            </div>

            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSubmit={handlePostSubmit}
            />
        </main>
    )
}