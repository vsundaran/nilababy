/**
 * Nilababy Design System - Unified Theme
 */

export const Colors = {
  primary: "#aabaf8",
  backgroundLight: "#FFF9F7",
  backgroundDark: "#101422",
  lavenderSoft: "#B8A8F8",
  white: "#FFFFFF",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
} as const;

export const Typography = {
  fontFamily: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
} as const;

export const Theme = {
  Colors,
  Typography,
  // Status Bar configuration
  StatusBar: {
    light: {
      style: 'light' as const,
      backgroundColor: 'transparent',
      translucent: true,
    },
    dark: {
      style: 'dark' as const,
      backgroundColor: 'transparent',
      translucent: true,
    },
    auto: {
      style: 'auto' as const,
      backgroundColor: 'transparent',
      translucent: true,
    }
  }
} as const;

export default Theme;
