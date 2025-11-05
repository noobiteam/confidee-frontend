import { useState } from 'react'
import { useConfideeContract, useGetTotalSecrets } from './useConfideeContract'
import { CONTENT_LIMITS } from '@/constants/app'
import { getUserFriendlyError } from '@/utils/errorMessages'

export function usePostForm() {
    const [postContent, setPostContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const { createSecret } = useConfideeContract()
    const { total: totalSecrets } = useGetTotalSecrets()

    const handleSubmit = async (onSuccess?: (secretId: number, content: string) => void) => {
        setError('')
        setIsSubmitting(true)

        if (!postContent.trim()) {
            setError('Please write something to share')
            setIsSubmitting(false)
            return
        }

        if (postContent.length > CONTENT_LIMITS.POST_MAX_LENGTH) {
            setError(`Post is too long (max ${CONTENT_LIMITS.POST_MAX_LENGTH} characters)`)
            setIsSubmitting(false)
            return
        }

        try {
            await createSecret(postContent)

            const newSecretId = totalSecrets + 1
            const savedContent = postContent

            setSuccess(true)
            setPostContent('')

            // Call success callback if provided
            if (onSuccess) {
                onSuccess(newSecretId, savedContent)
            }
        } catch (err) {
            console.error('Error creating post:', err)
            setError(getUserFriendlyError(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setPostContent('')
        setError('')
        setSuccess(false)
        setIsSubmitting(false)
    }

    return {
        postContent,
        setPostContent,
        isSubmitting,
        error,
        setError,
        success,
        setSuccess,
        handleSubmit,
        resetForm,
    }
}
