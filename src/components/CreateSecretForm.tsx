'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useConfideeContract } from '@/hooks/useConfideeContract';
import { encryptData, generateEncryptionKey } from '@/utils/encryption';

export function CreateSecretForm() {
  const { isConnected } = useAccount();
  const { createSecret, isWritePending, isConfirming, hash } = useConfideeContract();

  const [secretText, setSecretText] = useState('');
  const [password, setPassword] = useState('');
  const [useRandomKey, setUseRandomKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!secretText.trim()) {
      setError('Please enter your secret');
      return;
    }

    try {
      // Generate or use password
      const encryptionKey = useRandomKey ? generateEncryptionKey() : password;

      if (!useRandomKey && !password) {
        setError('Please enter a password or use auto-generated key');
        return;
      }

      // Encrypt the secret
      const encryptedData = encryptData(secretText, encryptionKey);

      // Send to blockchain
      await createSecret(encryptedData);

      // Save generated key if random
      if (useRandomKey) {
        setGeneratedKey(encryptionKey);
      }

      setSuccess(true);
      setSecretText('');
      setPassword('');

    } catch (err) {
      console.error('Error creating secret:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create secret';
      setError(errorMessage);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <p className="text-gray-600 text-center">
          Please connect your wallet to create secrets
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Secret</h2>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <p className="font-semibold">Secret created successfully!</p>
          {generatedKey && (
            <div className="mt-2">
              <p className="text-sm font-semibold">🔑 Save this encryption key:</p>
              <p className="text-xs bg-white p-2 rounded mt-1 break-all font-mono">
                {generatedKey}
              </p>
              <p className="text-xs mt-1 text-red-600">
                ⚠️ Save this key! You&apos;ll need it to decrypt your secret later.
              </p>
            </div>
          )}
          {hash && (
            <p className="text-xs mt-2">
              Transaction: <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on BaseScan
              </a>
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Secret
          </label>
          <textarea
            value={secretText}
            onChange={(e) => setSecretText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Enter your secret message..."
            disabled={isWritePending || isConfirming}
          />
        </div>

        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="useRandomKey"
              checked={useRandomKey}
              onChange={(e) => setUseRandomKey(e.target.checked)}
              className="mr-2"
              disabled={isWritePending || isConfirming}
            />
            <label htmlFor="useRandomKey" className="text-sm font-medium text-gray-700">
              Auto-generate encryption key (recommended)
            </label>
          </div>

          {!useRandomKey && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encryption Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password to encrypt your secret"
                disabled={isWritePending || isConfirming}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isWritePending || isConfirming}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isWritePending && 'Waiting for approval...'}
          {isConfirming && 'Creating secret...'}
          {!isWritePending && !isConfirming && 'Create Secret'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-600">
        <p className="font-semibold mb-1">💡 How it works:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Your secret is encrypted before being sent to blockchain</li>
          <li>Only you (and people you share with) can decrypt it</li>
          <li>Each transaction costs a small gas fee (Base Sepolia ETH)</li>
          <li>Data is stored permanently on-chain</li>
        </ul>
      </div>
    </div>
  );
}
