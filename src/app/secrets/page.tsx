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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Confidee</h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access your secrets
          </p>
          <ConnectWallet />
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Secrets on Chain</h3>
            <p className="text-3xl font-bold text-blue-600">
              {isLoading ? '...' : total}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Network</h3>
            <p className="text-lg font-semibold text-gray-900">Base Sepolia</p>
            <a
              href={CONTRACT_CONFIG.contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Contract →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Contract Address</h3>
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
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔐 How to use Confidee Secrets:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
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
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
