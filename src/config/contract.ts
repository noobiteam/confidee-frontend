/**
 * Confidee Smart Contract Configuration
 * Base Sepolia Testnet
 */

export const CONTRACT_CONFIG = {
  // Contract address di Base Sepolia (New Global Feed Version)
  address: "0xcbc7049A98736d05dB5a927966F9E3ab3a393e90" as `0x${string}`,

  // Network details
  chainId: 84532, // Base Sepolia
  chainName: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",

  // Block explorer
  explorerUrl: "https://sepolia.basescan.org",
  explorerName: "BaseScan",

  // Contract URL
  contractUrl: "https://sepolia.basescan.org/address/0xcbc7049A98736d05dB5a927966F9E3ab3a393e90",

  // Deployer info
  deployer: "0xD9D4F8cE84fB1253a4f2906ED2f67f4702F13f86",
  deployedAt: new Date("2025-10-17"), // Deployment date
} as const;

// Base Sepolia network config untuk wagmi/viem
export const BASE_SEPOLIA = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.base.org'] },
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;
