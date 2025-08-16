'use client'

import { ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)

const wallets = [
    new PhantomWalletAdapter(),
]

interface WalletContextProviderProps {
    children: ReactNode
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    )
}