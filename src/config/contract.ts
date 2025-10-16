/**
 * Confidee Smart Contract Configuration
 * Base Sepolia Testnet
 */

export const CONTRACT_CONFIG = {
  // Contract address di Base Sepolia
  address: "0xAA095A42912333B4888269CCdE1286E02609493f" as `0x${string}`,

  // Network details
  chainId: 84532, // Base Sepolia
  chainName: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",

  // Block explorer
  explorerUrl: "https://sepolia.basescan.org",
  explorerName: "BaseScan",

  // Contract URL
  contractUrl: "https://sepolia.basescan.org/address/0xaa095a42912333b4888269ccde1286e02609493f",

  // Deployer info
  deployer: "0xD9D4F8cE84fB1253a4f2906ED2f67f4702F13f86",
  deployedAt: new Date("2025-10-16"), // Deployment date
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
