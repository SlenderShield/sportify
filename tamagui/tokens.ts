export const tokens = {
  color: {
    // ===== LIGHT THEME COLORS =====
    
    // Primary - Modern blue with excellent contrast
    primary: '#2563EB', // Blue 600 - Perfect for both themes
    primaryLight: '#3B82F6', // Blue 500
    primaryDark: '#1D4ED8', // Blue 700
    primarySubtle: '#DBEAFE', // Blue 100
    
    // Secondary - Complementary purple/violet
    secondary: '#7C3AED', // Violet 600
    secondaryLight: '#8B5CF6', // Violet 500  
    secondaryDark: '#6D28D9', // Violet 700
    secondarySubtle: '#EDE9FE', // Violet 100
    
    // Accent - Energetic orange for CTAs
    accent: '#EA580C', // Orange 600
    accentLight: '#F97316', // Orange 500
    accentDark: '#C2410C', // Orange 700
    accentSubtle: '#FED7AA', // Orange 200
    
    // Neutral colors - Light theme
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC', // Slate 50
    backgroundTertiary: '#F1F5F9', // Slate 100
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceSecondary: '#F8FAFC',
    
    // Text colors - Light theme  
    text: '#0F172A', // Slate 900
    textSecondary: '#475569', // Slate 600
    textTertiary: '#64748B', // Slate 500
    textMuted: '#94A3B8', // Slate 400
    textInverse: '#FFFFFF',
    
    // Border colors - Light theme
    border: '#E2E8F0', // Slate 200
    borderSubtle: '#F1F5F9', // Slate 100
    borderFocus: '#2563EB', // Primary blue
    
    // ===== DARK THEME COLORS =====
    
    // Primary - Lighter, more vibrant for dark backgrounds
    primaryDark: '#60A5FA', // Blue 400 - Great contrast on dark
    primaryLightDark: '#93C5FD', // Blue 300
    primaryDarkDark: '#3B82F6', // Blue 500
    primarySubtleDark: '#1E3A8A', // Blue 800
    
    // Secondary - Adjusted for dark theme
    secondaryDark: '#A78BFA', // Violet 400
    secondaryLightDark: '#C4B5FD', // Violet 300
    secondaryDarkDark: '#8B5CF6', // Violet 500
    secondarySubtleDark: '#4C1D95', // Violet 800
    
    // Accent - Warm orange for dark theme
    accentDark: '#FB923C', // Orange 400
    accentLightDark: '#FDBA74', // Orange 300
    accentDarkDark: '#F97316', // Orange 500
    accentSubtleDark: '#9A3412', // Orange 800
    
    // Neutral colors - Dark theme (Professional dark palette)
    backgroundDark: '#0F172A', // Slate 900
    backgroundSecondaryDark: '#1E293B', // Slate 800
    backgroundTertiaryDark: '#334155', // Slate 700
    surfaceDark: '#1E293B', // Slate 800
    surfaceElevatedDark: '#334155', // Slate 700
    surfaceSecondaryDark: '#475569', // Slate 600
    
    // Text colors - Dark theme
    textDark: '#F8FAFC', // Slate 50
    textSecondaryDark: '#CBD5E1', // Slate 300
    textTertiaryDark: '#94A3B8', // Slate 400
    textMutedDark: '#64748B', // Slate 500
    textInverseDark: '#0F172A', // Slate 900
    
    // Border colors - Dark theme
    borderDark: '#334155', // Slate 700
    borderSubtleDark: '#475569', // Slate 600
    borderFocusDark: '#60A5FA', // Primary blue for dark
    
    // ===== STATUS COLORS (Works for both themes) =====
    
    // Success - Green
    success: '#059669', // Emerald 600
    successLight: '#10B981', // Emerald 500
    successDark: '#065F46', // Emerald 800
    successSubtle: '#D1FAE5', // Emerald 100
    
    successDarkTheme: '#34D399', // Emerald 400 (for dark backgrounds)
    successLightDarkTheme: '#6EE7B7', // Emerald 300
    successDarkDarkTheme: '#10B981', // Emerald 500
    successSubtleDarkTheme: '#064E3B', // Emerald 900
    
    // Warning - Amber
    warning: '#D97706', // Amber 600
    warningLight: '#F59E0B', // Amber 500
    warningDark: '#92400E', // Amber 700
    warningSubtle: '#FEF3C7', // Amber 100
    
    warningDarkTheme: '#FBBF24', // Amber 400
    warningLightDarkTheme: '#FCD34D', // Amber 300
    warningDarkDarkTheme: '#F59E0B', // Amber 500
    warningSubtleDarkTheme: '#78350F', // Amber 800
    
    // Error - Red
    error: '#DC2626', // Red 600
    errorLight: '#EF4444', // Red 500
    errorDark: '#B91C1C', // Red 700
    errorSubtle: '#FEE2E2', // Red 100
    
    errorDarkTheme: '#F87171', // Red 400
    errorLightDarkTheme: '#FCA5A5', // Red 300
    errorDarkDarkTheme: '#EF4444', // Red 500
    errorSubtleDarkTheme: '#7F1D1D', // Red 900
    
    // Info - Sky
    info: '#0284C7', // Sky 600
    infoLight: '#0EA5E9', // Sky 500
    infoDark: '#0C4A6E', // Sky 800
    infoSubtle: '#E0F2FE', // Sky 100
    
    infoDarkTheme: '#38BDF8', // Sky 400
    infoLightDarkTheme: '#7DD3FC', // Sky 300
    infoDarkDarkTheme: '#0EA5E9', // Sky 500
    infoSubtleDarkTheme: '#0C4A6E', // Sky 900
    
    // ===== GLASSMORPHISM & OVERLAY COLORS =====
    
    // Light theme glass effects
    glass: 'rgba(255, 255, 255, 0.8)',
    glassSubtle: 'rgba(255, 255, 255, 0.6)',
    glassStrong: 'rgba(255, 255, 255, 0.95)',
    overlay: 'rgba(15, 23, 42, 0.5)', // Slate 900 with opacity
    
    // Dark theme glass effects
    glassDark: 'rgba(51, 65, 85, 0.8)', // Slate 700 with opacity
    glassSubtleDark: 'rgba(51, 65, 85, 0.6)',
    glassStrongDark: 'rgba(30, 41, 59, 0.95)', // Slate 800 with opacity
    overlayDark: 'rgba(0, 0, 0, 0.7)',
    
    // Brand specific glass effects
    glassAccent: 'rgba(37, 99, 235, 0.1)', // Primary with low opacity
    glassAccentDark: 'rgba(96, 165, 250, 0.15)', // Primary dark with opacity
    glassSecondary: 'rgba(124, 58, 237, 0.1)', // Secondary with low opacity
    glassSecondaryDark: 'rgba(167, 139, 250, 0.15)', // Secondary dark with opacity
  },
  space: {
    0: 0,
    1: 2,
    2: 4,
    3: 8,
    4: 12,
    5: 16,
    6: 20,
    7: 24,
    8: 32,
    9: 40,
    10: 48,
    11: 56,
    12: 64,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
    full: 9999,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
  },
  shadow: {
    // Subtle shadows for modern depth
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 16,
      elevation: 8,
    },
    // Colored shadows for accent elements
    primary: {
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
    secondary: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
    accent: {
      shadowColor: '#EA580C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};
