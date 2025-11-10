/**
 * Confidee Smart Contract Configuration
 * Base Sepolia Testnet
 */

export const CONTRACT_CONFIG = {
  // V2 Contract with meta-transaction support (2.5% fee)
  address: "0x75a75c56c7e92a13CB16347f2A29E9869F348d64" as `0x${string}`,

  chainId: 84532,
  chainName: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",

  // Block explorer
  explorerUrl: "https://sepolia.basescan.org",
  explorerName: "BaseScan",

  // Contract URL
  contractUrl: "https://sepolia.basescan.org/address/0x75a75c56c7e92a13CB16347f2A29E9869F348d64",

  deployer: "0xD9D4F8cE84fB1253a4f2906ED2f67f4702F13f86",
  deployedAt: new Date("2025-11-10"), // V2 deployment
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
