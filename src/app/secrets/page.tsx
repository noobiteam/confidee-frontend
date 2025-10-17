'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectWallet } from '@/components/ConnectWallet';
import { CreateSecretForm } from '@/components/CreateSecretForm';
import { MySecretsList } from '@/components/MySecretsList';
import { useGetTotalSecrets } from '@/hooks/useConfideeContract';
import { CONTRACT_CONFIG } from '@/config/contract';
import Link from 'next/link';

export default function SecretsPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { total, isLoading } = useGetTotalSecrets();

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
        <div className="relative max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Welcome to Confidee</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Please connect your wallet to access your secrets
          </p>
          <ConnectWallet />
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
      <div className="relative flex-1">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                Confidee
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">Secrets Manager</span>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24 sm:pt-32">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Total Secrets on Chain</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {isLoading ? '...' : total}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Network</h3>
            <p className="text-base sm:text-lg font-semibold text-gray-900">Base Sepolia</p>
            <a
              href={CONTRACT_CONFIG.contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View Contract →
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Contract Address</h3>
            <p className="text-xs font-mono text-gray-700 break-all">
              {CONTRACT_CONFIG.address}
            </p>
          </div>
        </div>

        {/* Create Secret Form */}
        <div className="mb-8">
          <CreateSecretForm />
        </div>

        {/* My Secrets List */}
        <div>
          <MySecretsList />
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">🔐 How to use Confidee Secrets:</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
            <li>1. <strong>Create Secret:</strong> Enter your message and it will be encrypted before being stored on blockchain</li>
            <li>2. <strong>Save Your Key:</strong> Keep your encryption key safe - you&apos;ll need it to decrypt later</li>
            <li>3. <strong>View Secrets:</strong> Click on any secret to decrypt and view the original message</li>
            <li>4. <strong>Share (Coming Soon):</strong> Share secrets with specific addresses securely</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              💡 <strong>Pro Tip:</strong> All data is stored on Base Sepolia testnet. Make sure you have some testnet ETH for gas fees.
              <a
                href="https://bridge.base.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
              >
                Get testnet ETH →
              </a>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      </div>
    </main>
  );
}
