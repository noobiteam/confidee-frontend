import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import ConfideeABI from '@/abi/Confidee.json';
import { Address } from 'viem';

/**
 * Hook untuk interact dengan Confidee smart contract
 */
export function useConfideeContract() {
  const { writeContractAsync, data: hash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Create new secret
   */
  const createSecret = async (encryptedData: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'createSecret',
        args: [encryptedData],
      });
      return hash;
    } catch (error) {
      console.error('Create secret error:', error);
      throw error;
    }
  };

  /**
   * Share secret dengan address lain
   */
  const shareSecret = async (secretId: bigint, sharedWith: Address) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'shareSecret',
        args: [secretId, sharedWith],
      });
      return hash;
    } catch (error) {
      console.error('Share secret error:', error);
      throw error;
    }
  };

  /**
   * Revoke access dari address
   */
  const revokeAccess = async (secretId: bigint, revokeFrom: Address) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'revokeAccess',
        args: [secretId, revokeFrom],
      });
      return hash;
    } catch (error) {
      console.error('Revoke access error:', error);
      throw error;
    }
  };

  /**
   * Delete secret
   */
  const deleteSecret = async (secretId: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'deleteSecret',
        args: [secretId],
      });
      return hash;
    } catch (error) {
      console.error('Delete secret error:', error);
      throw error;
    }
  };

  return {
    createSecret,
    shareSecret,
    revokeAccess,
    deleteSecret,
    isWritePending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

/**
 * Hook untuk read secret by ID
 */
export function useGetSecret(secretId: bigint | undefined) {
  const { address: account } = useAccount();

  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getSecret',
    args: secretId !== undefined ? [secretId] : undefined,
    account: account,
    query: {
      enabled: secretId !== undefined && !!account,
    },
  });

  type SecretType = {
    id: bigint;
    owner: Address;
    content: string;
    timestamp: bigint;
    isActive: boolean;
  };

  return {
    secret: data as SecretType | undefined,
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook untuk get user's secrets
 */
export function useGetMySecrets() {
  const { address: account } = useAccount();

  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getMySecrets',
    account: account,
    query: {
      enabled: !!account,
    },
  });

  return {
    secretIds: (data as bigint[]) || [],
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook untuk get secrets yang di-share ke user
 */
export function useGetSharedSecrets() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getSharedSecrets',
  });

  return {
    secretIds: (data as bigint[]) || [],
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook untuk get total secrets
 */
export function useGetTotalSecrets() {
  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getTotalSecrets',
  });

  return {
    total: data ? Number(data) : 0,
    isError,
    isLoading,
  };
}

/**
 * Hook untuk get list address yang punya akses ke secret
 */
export function useGetSharedWith(secretId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getSharedWith',
    args: secretId !== undefined ? [secretId] : undefined,
    query: {
      enabled: secretId !== undefined,
    },
  });

  return {
    addresses: (data as Address[]) || [],
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook untuk get latest secrets (Global Feed)
 */
export function useGetLatestSecrets(limit: number = 20) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getLatestSecrets',
    args: [BigInt(limit)],
  });

  type SecretType = {
    id: bigint;
    owner: Address;
    content: string;
    timestamp: bigint;
    isActive: boolean;
  };

  return {
    secrets: (data as SecretType[]) || [],
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook untuk get all secrets dengan pagination
 */
export function useGetAllSecrets(offset: number = 0, limit: number = 20) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getAllSecrets',
    args: [BigInt(offset), BigInt(limit)],
  });

  type SecretType = {
    id: bigint;
    owner: Address;
    content: string;
    timestamp: bigint;
    isActive: boolean;
  };

  return {
    secrets: (data as SecretType[]) || [],
    isError,
    isLoading,
    refetch,
  };
}
