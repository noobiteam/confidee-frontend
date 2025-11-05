import { useState, useCallback } from 'react'

interface UseOptimisticLikeProps {
    initialLiked: boolean
    initialCount: number
    onLike: () => Promise<void>
    onUnlike: () => Promise<void>
}

export function useOptimisticLike({
    initialLiked,
    initialCount,
    onLike,
    onUnlike
}: UseOptimisticLikeProps) {
    const [isLiked, setIsLiked] = useState(initialLiked)
    const [likeCount, setLikeCount] = useState(initialCount)
    const [isLoading, setIsLoading] = useState(false)

    const toggleLike = useCallback(async () => {
        // Optimistic update - immediately update UI
        const previousLiked = isLiked
        const previousCount = likeCount

        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
        setIsLoading(true)

        try {
            // Perform actual blockchain transaction
            if (isLiked) {
                await onUnlike()
            } else {
                await onLike()
            }
            // Success - optimistic update was correct
        } catch (error) {
            // Revert optimistic update on error
            setIsLiked(previousLiked)
            setLikeCount(previousCount)
            throw error // Re-throw to let caller handle error
        } finally {
            setIsLoading(false)
        }
    }, [isLiked, likeCount, onLike, onUnlike])

    // Sync with external state changes (e.g., refetch from blockchain)
    const sync = useCallback((liked: boolean, count: number) => {
        setIsLiked(liked)
        setLikeCount(count)
    }, [])

    return {
        isLiked,
        likeCount,
        isLoading,
        toggleLike,
        sync,
    }
}
