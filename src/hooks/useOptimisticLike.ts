import { useState, useCallback, useEffect } from 'react'

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
    const [hasUserInteracted, setHasUserInteracted] = useState(false)

    useEffect(() => {
        if (!isLoading && !hasUserInteracted) {
            setIsLiked(initialLiked)
            setLikeCount(initialCount)
        }
    }, [initialLiked, initialCount, isLoading, hasUserInteracted])

    const toggleLike = useCallback(async () => {
        const previousLiked = isLiked
        const previousCount = likeCount

        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
        setIsLoading(true)
        setHasUserInteracted(true)

        try {
            if (isLiked) {
                await onUnlike()
            } else {
                await onLike()
            }
        } catch (error) {
            setIsLiked(previousLiked)
            setLikeCount(previousCount)
            throw error
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
