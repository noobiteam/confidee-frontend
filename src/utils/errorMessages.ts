export function getUserFriendlyError(err: unknown): string {
    if (!(err instanceof Error)) return 'An unexpected error occurred'

    const errorMessage = err.message.toLowerCase()

    if (errorMessage.includes('user rejected') ||
        errorMessage.includes('user denied') ||
        errorMessage.includes('user cancelled')) {
        return 'Transaction cancelled. No worries, you can try again anytime!'
    }

    if (errorMessage.includes('insufficient funds') ||
        errorMessage.includes('insufficient balance') ||
        errorMessage.includes('exceeds balance')) {
        return 'Insufficient funds in your wallet. Please add more ETH and try again.'
    }

    if (errorMessage.includes('gas required exceeds allowance') ||
        errorMessage.includes('out of gas') ||
        errorMessage.includes('gas limit')) {
        return 'Transaction requires more gas than available. Try increasing gas limit or check your balance.'
    }

    if (errorMessage.includes('transaction reverted') ||
        errorMessage.includes('execution reverted') ||
        errorMessage.includes('revert')) {
        return 'Transaction failed on blockchain. The smart contract rejected this operation.'
    }

    if (errorMessage.includes('invalid address') ||
        errorMessage.includes('invalid argument') ||
        errorMessage.includes('invalid input')) {
        return 'Invalid input detected. Please check your data and try again.'
    }

    if (errorMessage.includes('timeout') ||
        errorMessage.includes('timed out') ||
        errorMessage.includes('request took too long')) {
        return 'Request timed out. The blockchain might be slow. Please try again.'
    }

    if (errorMessage.includes('network') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('failed to fetch')) {
        return 'Network error. Please check your connection and try again.'
    }

    if (errorMessage.includes('nonce') ||
        errorMessage.includes('already known')) {
        return 'Transaction conflict detected. Please wait and try again in a moment.'
    }

    return `Transaction failed: ${err.message.substring(0, 100)}`
}
