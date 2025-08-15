'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import WalletModal from './WalletModal'

export default function WalletButton() {
    const { publicKey, disconnect, connecting } = useWallet()
    const [mounted, setMounted] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="bg-gray-400 cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium">
                Loading...
            </button>
        )
    }

    if (connecting) {
        return (
            <button className="bg-blue-500 cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium">
                Connecting...
            </button>
        )
    }

    if (publicKey) {
        const shortAddress = `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`

        return (
            <div className="relative group">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors">
                    {shortAddress}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3">
                        <div className="text-xs text-gray-500 mb-2">Connected Wallet</div>
                        <div className="text-sm font-mono text-gray-900 mb-3 break-all">{publicKey.toString()}</div>
                        <button
                            onClick={disconnect}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors"
            >
                Connect Wallet
            </button>

            <WalletModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}