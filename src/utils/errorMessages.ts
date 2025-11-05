/**
 * Parse blockchain/wallet errors into user-friendly messages
 */
export function getUserFriendlyError(err: unknown): string {
    if (!(err instanceof Error)) return 'An unexpected error occurred'

    const errorMessage = err.message.toLowerCase()

    // User rejected transaction
    if (errorMessage.includes('user rejected') ||
        errorMessage.includes('user denied') ||
        errorMessage.includes('user cancelled')) {
        return 'Transaction cancelled. No worries, you can try again anytime!'
    }

    // Insufficient funds
    if (errorMessage.includes('insufficient funds') ||
        errorMessage.includes('insufficient balance')) {
        return 'Insufficient funds in your wallet. Please add more ETH and try again.'
    }

    // Network issues
    if (errorMessage.includes('network') ||
        errorMessage.includes('connection')) {
        return 'Network error. Please check your connection and try again.'
    }

    // Generic fallback
    return err.message
}
