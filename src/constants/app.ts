/**
 * Application-wide constants
 * Centralized place for magic numbers and configuration values
 */

// ==================== DATA FETCHING ====================
export const DATA_FETCH = {
  /** Number of latest secrets to fetch from blockchain */
  LATEST_SECRETS_LIMIT: 50,

  /** Polling interval for transaction confirmations (ms) */
  TX_POLL_INTERVAL: 1000,

  /** Delay before refetching after transaction (ms) */
  REFETCH_DELAY: 2000,

  /** Delay for AI reply generation trigger (ms) */
  AI_REPLY_DELAY: 4000,
} as const

// ==================== CONTENT LIMITS ====================
export const CONTENT_LIMITS = {
  /** Maximum post content length */
  POST_MAX_LENGTH: 1000,

  /** Maximum comment content length */
  COMMENT_MAX_LENGTH: 500,

  /** Character count warning threshold (yellow) */
  WARNING_THRESHOLD: 0.8, // 80% of max

  /** Character count danger threshold (red) */
  DANGER_THRESHOLD: 0.95, // 95% of max
} as const

// ==================== UI TIMEOUTS ====================
export const UI_TIMEOUTS = {
  /** Auto-dismiss success messages (ms) */
  SUCCESS_MESSAGE: 5000,

  /** Auto-dismiss error messages (ms) - set to 0 to disable */
  ERROR_MESSAGE: 5000,

  /** Loading screen delay (ms) */
  LOADING_DELAY: 800,
} as const

// ==================== TIP AMOUNTS ====================
export const TIP_PRESETS = {
  /** Preset tip amounts in ETH */
  AMOUNTS: [0.001, 0.005, 0.01, 0.05] as const,

  /** Platform fee percentage */
  PLATFORM_FEE: 0.025, // 2.5%

  /** Minimum tip amount */
  MIN_AMOUNT: 0.0001,
} as const

// ==================== BLOCKCHAIN ====================
export const BLOCKCHAIN = {
  /** Contract address */
  CONTRACT_ADDRESS: "0x49BaCB0B84b261Ee998CC057bA6ad25cC0Ff626F" as `0x${string}`,

  /** Block explorer base URL */
  EXPLORER_URL: "https://sepolia.basescan.org",

  /** Get contract URL */
  getContractUrl: () => `${BLOCKCHAIN.EXPLORER_URL}/address/${BLOCKCHAIN.CONTRACT_ADDRESS}`,

  /** Get transaction URL */
  getTxUrl: (hash: string) => `${BLOCKCHAIN.EXPLORER_URL}/tx/${hash}`,
} as const

// ==================== ROUTES ====================
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SECRETS: '/secrets',
  POST_DETAIL: (id: string | number) => `/post/${id}`,
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const
