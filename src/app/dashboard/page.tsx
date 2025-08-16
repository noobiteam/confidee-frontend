'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WalletButton from '@/components/WalletButton'
import CreatePostModal from '@/components/CreatePostModal'
import PostCard from '@/components/PostCard'
import ReplyModal from '@/components/ReplyModal'
import UsernameModal from '@/components/UsernameModal'
import { hasUsername, saveUsername, getUsername } from '@/utils/username'

export default function DashboardPage() {
    const { publicKey } = useWallet()
    const router = useRouter()
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
    const [isEditingUsername, setIsEditingUsername] = useState(false)
    const [replyingToPostId, setReplyingToPostId] = useState<string>('')
    const [posts, setPosts] = useState<Array<{
        id: string,
        content: string,
        timestamp: Date,
        wallet: string,
        aiResponse?: {
            content: string,
            timestamp: Date
        },
        replies: Array<{
            id: string,
            content: string,
            timestamp: Date,
            wallet: string
        }>
    }>>([])

    useEffect(() => {
        if (!publicKey) {
            router.push('/')
            return
        }

        const walletAddress = publicKey.toString()
        if (!hasUsername(walletAddress)) {
            setIsUsernameModalOpen(true)
            setIsEditingUsername(false)
        }
    }, [publicKey, router])

    const handleEditUsername = () => {
        setIsEditingUsername(true)
        setIsUsernameModalOpen(true)
    }

    const handleUsernameSubmit = (username: string) => {
        if (publicKey) {
            saveUsername(publicKey.toString(), username)
        }
        setIsEditingUsername(false)
    }

    const handleUsernameModalClose = () => {
        if (!isEditingUsername) {
            return
        }
        setIsUsernameModalOpen(false)
        setIsEditingUsername(false)
    }

    const getCurrentUsername = () => {
        if (!publicKey) return ''
        return getUsername(publicKey.toString()) || ''
    }

    const handlePostSubmit = (content: string) => {
        const newPost = {
            id: Date.now().toString(),
            content,
            timestamp: new Date(),
            wallet: publicKey?.toString() || '',
            replies: []
        }
        setPosts(prev => [newPost, ...prev])

        setTimeout(() => {
            const aiResponseContent = generateAIResponse(content)
            setPosts(prev => prev.map(post =>
                post.id === newPost.id
                    ? {
                        ...post,
                        aiResponse: {
                            content: aiResponseContent,
                            timestamp: new Date()
                        }
                    }
                    : post
            ))
        }, 2000)
    }

    const handleReplyClick = (postId: string) => {
        setReplyingToPostId(postId)
        setIsReplyModalOpen(true)
    }

    const handleReplySubmit = (content: string) => {
        const newReply = {
            id: Date.now().toString(),
            content,
            timestamp: new Date(),
            wallet: publicKey?.toString() || ''
        }

        setPosts(prev => prev.map(post =>
            post.id === replyingToPostId
                ? {
                    ...post,
                    replies: [...post.replies, newReply]
                }
                : post
        ))
    }

    const generateAIResponse = (postContent: string) => {
        const responses = [
            "I hear you anon. That sounds really tough. Remember that setbacks are temporary, and you're stronger than you think. Take it one day at a time.",
            "Thanks for sharing this with us. What you're feeling is completely valid. Have you considered talking to someone you trust about this?",
            "That's a lot to process. Sometimes writing down our thoughts like this can be the first step toward feeling better. You're not alone in this.",
            "I appreciate you being vulnerable here. It takes courage to share what's really on your mind. How are you taking care of yourself right now?",
            "This resonates with me. Life can be overwhelming sometimes. What's one small thing that usually helps you feel a bit better?",
            "Thank you for trusting the community with this. Your feelings matter, and it's okay to not have all the answers right now.",
            "I can sense the weight you're carrying. Sometimes just getting these thoughts out can provide some relief. What support do you have around you?"
        ]

        return responses[Math.floor(Math.random() * responses.length)]
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
                            <WalletButton onEditUsername={handleEditUsername} />
                        </div>
                    </div>
                </nav>

                <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Welcome to your safe space
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
                            Share whatever&apos;s on your heart, we&apos;re here to listen
                        </p>

                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors"
                        >
                            Ready to share?
                        </button>
                    </div>
                </section>

                <section className="pb-12 sm:pb-20 px-20">
                    <div className="mx-auto">
                        {posts.length > 0 ? (
                            <div className={`grid gap-6 ${posts.length === 1
                                ? 'grid-cols-1'
                                : posts.length === 2
                                    ? 'grid-cols-1 sm:grid-cols-2'
                                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                                }`}>
                                {posts.map((post, index) => (
                                    <div
                                        key={post.id}
                                        className={`${posts.length > 3 && posts.length % 3 === 1 && index === posts.length - 1
                                            ? 'md:col-start-2'
                                            : ''
                                            }`}
                                    >
                                        <PostCard
                                            id={post.id}
                                            content={post.content}
                                            timestamp={post.timestamp}
                                            wallet={post.wallet}
                                            aiResponse={post.aiResponse}
                                            replies={post.replies}
                                            onReply={handleReplyClick}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 rounded-2xl p-8 sm:p-12">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Your space is ready for your first thought</h3>
                                    <p className="text-gray-600">
                                        This is where your story begins
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSubmit={handlePostSubmit}
            />

            <ReplyModal
                isOpen={isReplyModalOpen}
                onClose={() => setIsReplyModalOpen(false)}
                onSubmit={handleReplySubmit}
                postId={replyingToPostId}
            />

            <UsernameModal
                isOpen={isUsernameModalOpen}
                onClose={handleUsernameModalClose}
                onSubmit={handleUsernameSubmit}
                currentUsername={getCurrentUsername()}
                isEditing={isEditingUsername}
            />
        </main>
    )
}