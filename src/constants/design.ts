/**
 * Design System Constants
 * Centralized design tokens for colors, typography, spacing, and animations
 */

// ==================== COLOR PALETTE ====================
export const COLORS = {
  // Primary - Blue (Main brand color)
  primary: {
    50: '#eff6ff',    // bg-blue-50
    100: '#dbeafe',   // bg-blue-100
    200: '#bfdbfe',   // bg-blue-200
    400: '#60a5fa',   // border-blue-400
    500: '#3b82f6',   // bg-blue-500, text-blue-500
    600: '#2563eb',   // bg-blue-600 (CTA buttons)
    700: '#1d4ed8',   // bg-blue-700 (hover state)
    800: '#1e40af',   // text-blue-800
    900: '#1e3a8a',   // text-blue-900
  },

  // Secondary - Purple (Accents & highlights)
  secondary: {
    50: '#faf5ff',    // bg-purple-50
    100: '#f3e8ff',   // bg-purple-100
    600: '#9333ea',   // text-purple-600
    700: '#7e22ce',   // text-purple-700
  },

  // Success - Green
  success: {
    50: '#f0fdf4',    // bg-green-50
    100: '#dcfce7',   // bg-green-100
    600: '#16a34a',   // text-green-600
  },

  // Neutrals - Gray scale
  neutral: {
    50: '#f9fafb',    // bg-gray-50
    100: '#f3f4f6',   // bg-gray-100, border-gray-100
    200: '#e5e7eb',   // border-gray-200
    500: '#6b7280',   // text-gray-500
    600: '#4b5563',   // text-gray-600
    900: '#111827',   // text-gray-900
  },

  // Base colors
  white: '#ffffff',
  black: '#000000',
} as const

// ==================== TYPOGRAPHY ====================
export const TYPOGRAPHY = {
  // Font families (assuming you're using default Next.js fonts)
  fontFamily: {
    sans: 'var(--font-geist-sans)',  // Default sans-serif
    mono: 'var(--font-geist-mono)',  // Monospace
  },

  // Font sizes with line heights
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },      // text-xs
    sm: { size: '0.875rem', lineHeight: '1.25rem' },  // text-sm
    base: { size: '1rem', lineHeight: '1.5rem' },     // text-base
    lg: { size: '1.125rem', lineHeight: '1.75rem' },  // text-lg
    xl: { size: '1.25rem', lineHeight: '1.75rem' },   // text-xl
    '2xl': { size: '1.5rem', lineHeight: '2rem' },    // text-2xl
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' }, // text-3xl
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' },  // text-4xl
    '5xl': { size: '3rem', lineHeight: '1' },         // text-5xl
    '6xl': { size: '3.75rem', lineHeight: '1' },      // text-6xl
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

// ==================== SPACING ====================
export const SPACING = {
  // Padding/Margin scale (in rem)
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
} as const

// ==================== BORDER RADIUS ====================
export const RADIUS = {
  sm: '0.125rem',   // rounded-sm
  DEFAULT: '0.25rem', // rounded
  md: '0.375rem',   // rounded-md
  lg: '0.5rem',     // rounded-lg
  xl: '0.75rem',    // rounded-xl
  '2xl': '1rem',    // rounded-2xl
  full: '9999px',   // rounded-full
} as const

// ==================== SHADOWS ====================
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

// ==================== ANIMATIONS ====================
export const ANIMATIONS = {
  // Transition durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '600ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Framer Motion variants
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
} as const

// ==================== COMPONENT STYLES ====================
export const COMPONENTS = {
  // Button variants
  button: {
    primary: {
      base: 'font-semibold rounded-lg shadow-lg transition-all duration-200',
      bg: 'bg-blue-600 hover:bg-blue-700 text-white',
      hover: 'hover:shadow-xl hover:scale-105 active:scale-95',
    },
    secondary: {
      base: 'font-medium rounded-lg transition-all duration-200',
      bg: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    },
  },

  // Card variants
  card: {
    default: {
      base: 'rounded-2xl shadow-sm transition-all duration-200',
      hover: 'hover:shadow-xl hover:-translate-y-2',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border border-blue-100',
      icon: 'bg-blue-100 text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border border-purple-100',
      icon: 'bg-purple-100 text-purple-600',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border border-green-100',
      icon: 'bg-green-100 text-green-600',
    },
  },

  // Badge/Tag variants
  badge: {
    purple: 'bg-purple-100 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8',
    blue: 'bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-medium',
  },

  // Navigation
  nav: {
    base: 'fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100',
  },
} as const

// ==================== BREAKPOINTS ====================
export const BREAKPOINTS = {
  sm: '640px',   // @media (min-width: 640px)
  md: '768px',   // @media (min-width: 768px)
  lg: '1024px',  // @media (min-width: 1024px)
  xl: '1280px',  // @media (min-width: 1280px)
  '2xl': '1536px', // @media (min-width: 1536px)
} as const

// ==================== Z-INDEX LAYERS ====================
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 40,
  nav: 50,
  toast: 60,
} as const

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate className string for primary button
 */
export const getPrimaryButtonClass = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg',
    lg: 'px-8 py-4 text-lg',
  }

  return `${COMPONENTS.button.primary.base} ${COMPONENTS.button.primary.bg} ${COMPONENTS.button.primary.hover} ${sizeClasses[size]}`
}

/**
 * Generate className string for card
 */
export const getCardClass = (variant: 'blue' | 'purple' | 'green') => {
  const variantClasses = COMPONENTS.card[variant]
  return `${COMPONENTS.card.default.base} ${COMPONENTS.card.default.hover} ${variantClasses.bg} ${variantClasses.border}`
}
