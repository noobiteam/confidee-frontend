export default function PostDetailSkeleton() {
    return (
        <div className="animate-fade-in">
            {/* Main Post Skeleton */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
                <div className="flex items-start space-x-4">
                    {/* Avatar skeleton */}
                    <div className="animate-shimmer w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"></div>

                    <div className="flex-1 min-w-0">
                        {/* Header skeleton */}
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="animate-shimmer h-4 w-28 rounded"></div>
                            <div className="animate-shimmer h-4 w-4 rounded-full"></div>
                            <div className="animate-shimmer h-4 w-24 rounded"></div>
                        </div>

                        {/* Content skeleton - longer for detail page */}
                        <div className="space-y-3 mb-6">
                            <div className="animate-shimmer h-4 w-full rounded"></div>
                            <div className="animate-shimmer h-4 w-full rounded"></div>
                            <div className="animate-shimmer h-4 w-5/6 rounded"></div>
                            <div className="animate-shimmer h-4 w-4/6 rounded"></div>
                        </div>

                        {/* AI Reply skeleton */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="animate-shimmer w-4 h-4 rounded"></div>
                                <div className="animate-shimmer h-4 w-32 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="animate-shimmer h-4 w-full rounded"></div>
                                <div className="animate-shimmer h-4 w-4/5 rounded"></div>
                            </div>
                        </div>

                        {/* Actions skeleton */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="animate-shimmer h-6 w-16 rounded"></div>
                                <div className="animate-shimmer h-6 w-16 rounded"></div>
                                <div className="animate-shimmer h-6 w-16 rounded"></div>
                            </div>
                            <div className="animate-shimmer h-6 w-24 rounded"></div>
                        </div>

                        {/* Action buttons skeleton */}
                        <div className="flex gap-3">
                            <div className="animate-shimmer h-10 flex-1 rounded-lg"></div>
                            <div className="animate-shimmer h-10 flex-1 rounded-lg"></div>
                        </div>

                        {/* Footer skeleton */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="animate-shimmer h-3 w-36 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section Skeleton */}
            <div className="mb-8">
                <div className="animate-shimmer h-6 w-32 rounded mb-4"></div>

                {/* Comment skeletons */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-4">
                        <div className="flex items-start space-x-3">
                            <div className="animate-shimmer w-8 h-8 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="animate-shimmer h-3 w-24 rounded"></div>
                                    <div className="animate-shimmer h-3 w-3 rounded-full"></div>
                                    <div className="animate-shimmer h-3 w-20 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="animate-shimmer h-4 w-full rounded"></div>
                                    <div className="animate-shimmer h-4 w-3/4 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
