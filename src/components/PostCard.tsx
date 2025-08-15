'use client'

interface PostCardProps {
    id: string
    content: string
    timestamp: Date
    wallet: string
}

export default function PostCard({ content, timestamp, wallet }: PostCardProps) {
    const shortWallet = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
    const timeAgo = new Date(timestamp).toLocaleString()

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
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
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{shortWallet}</span>
                        <button className="hover:text-blue-600 transition-colors">Reply</button>
                        <button className="hover:text-green-600 transition-colors">Tip</button>
                    </div>
                </div>
            </div>
        </div>
    )
}