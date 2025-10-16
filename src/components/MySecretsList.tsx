'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useGetMySecrets, useGetSecret } from '@/hooks/useConfideeContract';
import { decryptData } from '@/utils/encryption';

export function MySecretsList() {
  const { isConnected } = useAccount();
  const { secretIds, isLoading } = useGetMySecrets();
  const [selectedSecret, setSelectedSecret] = useState<bigint | null>(null);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  if (!isConnected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 text-center">
          Connect your wallet to view your secrets
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 text-center">Loading your secrets...</p>
      </div>
    );
  }

  if (secretIds.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 text-center">
          You don&apos;t have any secrets yet. Create your first one above!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Secrets ({secretIds.length})</h2>

      <div className="space-y-3">
        {secretIds.map((secretId) => (
          <SecretItem
            key={secretId.toString()}
            secretId={secretId}
            isSelected={selectedSecret === secretId}
            onSelect={() => setSelectedSecret(secretId)}
            decryptionKey={decryptionKey}
            setDecryptionKey={setDecryptionKey}
            decryptedText={decryptedText}
            setDecryptedText={setDecryptedText}
            error={error}
            setError={setError}
          />
        ))}
      </div>
    </div>
  );
}

function SecretItem({
  secretId,
  isSelected,
  onSelect,
  decryptionKey,
  setDecryptionKey,
  decryptedText,
  setDecryptedText,
  error,
  setError,
}: {
  secretId: bigint;
  isSelected: boolean;
  onSelect: () => void;
  decryptionKey: string;
  setDecryptionKey: (key: string) => void;
  decryptedText: string;
  setDecryptedText: (text: string) => void;
  error: string;
  setError: (error: string) => void;
}) {
  const { secret, isLoading } = useGetSecret(secretId);

  const handleDecrypt = () => {
    setError('');
    setDecryptedText('');

    if (!secret) {
      setError('Secret not loaded');
      return;
    }

    if (!decryptionKey) {
      setError('Please enter decryption key');
      return;
    }

    try {
      const decrypted = decryptData(secret.encryptedData, decryptionKey);
      setDecryptedText(decrypted);
    } catch {
      setError('Failed to decrypt. Wrong key or corrupted data.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">Loading secret #{secretId.toString()}...</p>
      </div>
    );
  }

  if (!secret) {
    return null;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Secret #{secretId.toString()}</h3>
        <button
          onClick={onSelect}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isSelected ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-2">
        Created: {new Date(Number(secret.timestamp) * 1000).toLocaleString()}
      </p>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-1">Encrypted Data (on blockchain):</p>
            <p className="text-xs bg-gray-100 p-2 rounded break-all font-mono">
              {secret.encryptedData}
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              value={isSelected ? decryptionKey : ''}
              onChange={(e) => setDecryptionKey(e.target.value)}
              placeholder="Enter decryption key..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleDecrypt}
              className="w-full bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 transition-colors"
            >
              🔓 Decrypt Secret
            </button>

            {error && isSelected && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {decryptedText && isSelected && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-xs font-semibold text-green-800 mb-1">
                  Decrypted Message:
                </p>
                <p className="text-sm text-gray-800">{decryptedText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
