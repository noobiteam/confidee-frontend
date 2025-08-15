'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WalletButton from '@/components/WalletButton'

export default function DashboardPage() {
    const { publicKey } = useWallet()
    const router = useRouter()

    useEffect(() => {
        if (!publicKey) {
            router.push('/')
        }
    }, [publicKey, router])

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
                            <WalletButton />
                        </div>
                    </div>
                </nav>

                <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Welcome to your dashboard
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
                            Your anonymous safe space is being prepared. Coming soon.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}