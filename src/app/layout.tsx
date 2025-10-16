import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Web3Provider } from '@/providers/Web3Provider'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'Confidee',
  description: 'Share your thoughts anonymously, get AI-powered emotional support, and participate in a tokenized care economy.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={plusJakarta.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}