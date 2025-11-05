export default function PostCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Avatar skeleton */}
                <div className="animate-shimmer w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"></div>

                <div className="flex-1 min-w-0">
                    {/* Header skeleton */}
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="animate-shimmer h-4 w-24 rounded"></div>
                        <div className="animate-shimmer h-4 w-4 rounded-full"></div>
                        <div className="animate-shimmer h-4 w-20 rounded"></div>
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-2 mb-4">
                        <div className="animate-shimmer h-4 w-full rounded"></div>
                        <div className="animate-shimmer h-4 w-5/6 rounded"></div>
                        <div className="animate-shimmer h-4 w-4/6 rounded"></div>
                    </div>

                    {/* Actions skeleton */}
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                        <div className="animate-shimmer h-5 w-12 rounded"></div>
                        <div className="animate-shimmer h-5 w-12 rounded"></div>
                        <div className="animate-shimmer h-5 w-12 rounded"></div>
                    </div>

                    {/* Footer skeleton */}
                    <div className="pt-3 border-t border-gray-100">
                        <div className="animate-shimmer h-3 w-32 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
