import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import ConfideeABIJson from '@/abi/Confidee.json';
import { Address, type Abi } from 'viem';

const ConfideeABI = (ConfideeABIJson as { abi: Abi }).abi;

export function useConfideeContract() {
  const { writeContractAsync, data: hash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

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

  const likeSecret = async (secretId: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'likeSecret',
        args: [secretId],
      });
      return hash;
    } catch (error) {
      console.error('Like secret error:', error);
      throw error;
    }
  };

  const unlikeSecret = async (secretId: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'unlikeSecret',
        args: [secretId],
      });
      return hash;
    } catch (error) {
      console.error('Unlike secret error:', error);
      throw error;
    }
  };

  const createComment = async (secretId: bigint, content: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'createComment',
        args: [secretId, content],
      });
      return hash;
    } catch (error) {
      console.error('Create comment error:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'deleteComment',
        args: [commentId],
      });
      return hash;
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error;
    }
  };

  const tipPost = async (secretId: bigint, amountInEth: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: ConfideeABI,
        functionName: 'tipPost',
        args: [secretId],
        value: BigInt(Math.floor(parseFloat(amountInEth) * 1e18)),
      });
      return hash;
    } catch (error) {
      console.error('Tip post error:', error);
      throw error;
    }
  };

  return {
    createSecret,
    shareSecret,
    revokeAccess,
    deleteSecret,
    likeSecret,
    unlikeSecret,
    createComment,
    deleteComment,
    tipPost,
    isWritePending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

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

export function useGetLikeCount(secretId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getLikeCount',
    args: secretId !== undefined ? [secretId] : undefined,
    query: {
      enabled: secretId !== undefined,
    },
  });

  return {
    likeCount: data ? Number(data) : 0,
    isError,
    isLoading,
    refetch,
  };
}

export function useHasUserLiked(secretId: bigint | undefined, userAddress: Address | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'hasUserLiked',
    args: secretId !== undefined && userAddress ? [secretId, userAddress] : undefined,
    query: {
      enabled: secretId !== undefined && !!userAddress,
    },
  });

  return {
    hasLiked: data as boolean || false,
    isError,
    isLoading,
    refetch,
  };
}

export function useGetSecretLikes(secretId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getSecretLikes',
    args: secretId !== undefined ? [secretId] : undefined,
    query: {
      enabled: secretId !== undefined,
    },
  });

  return {
    likes: (data as Address[]) || [],
    isError,
    isLoading,
    refetch,
  };
}

export function useGetSecretComments(secretId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getSecretComments',
    args: secretId !== undefined ? [secretId] : undefined,
    query: {
      enabled: secretId !== undefined,
    },
  });

  type CommentType = {
    id: bigint;
    secretId: bigint;
    author: Address;
    content: string;
    timestamp: bigint;
    isActive: boolean;
  };

  return {
    comments: (data as CommentType[]) || [],
    isError,
    isLoading,
    refetch,
  };
}

export function useGetCommentCount(secretId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getCommentCount',
    args: secretId !== undefined ? [secretId] : undefined,
    query: {
      enabled: secretId !== undefined,
    },
  });

  return {
    commentCount: data ? Number(data) : 0,
    isError,
    isLoading,
    refetch,
  };
}

export function useGetTotalTips(secretId: bigint | undefined) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getTotalTips',
    args: secretId !== undefined ? [secretId] : undefined,
    query: {
      enabled: secretId !== undefined,
    },
  });

  return {
    totalTips: data ? Number(data) / 1e18 : 0,
    totalTipsWei: data ? data : BigInt(0),
    isError,
    isLoading,
    refetch,
  };
}
