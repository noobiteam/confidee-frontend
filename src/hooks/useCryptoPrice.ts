import { useState, useEffect } from 'react'

interface UseCryptoPriceResult {
    price: number | null
    isLoading: boolean
    error: string | null
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price'

export function useCryptoPrice(enabled: boolean = true): UseCryptoPriceResult {
    const [price, setPrice] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled) {
            return
        }

        const fetchPrice = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `${COINGECKO_API}?ids=ethereum&vs_currencies=usd`,
                    {
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch price')
                }

                const data = await response.json()
                const ethPrice = data?.ethereum?.usd

                if (typeof ethPrice === 'number') {
                    setPrice(ethPrice)
                } else {
                    throw new Error('Invalid price data')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch price')
                setPrice(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPrice()
    }, [enabled])

    return { price, isLoading, error }
}
