import { tokens } from "./tokens"

export const themes = {
  light: {
    // Background colors - Clean and minimal
    background: tokens.color.background,
    backgroundElevated: tokens.color.surfaceElevated, // For compatibility
    backgroundSecondary: tokens.color.backgroundSecondary,
    backgroundTertiary: tokens.color.backgroundTertiary,
    surface: tokens.color.surface,
    surfaceElevated: tokens.color.surfaceElevated,
    surfaceSecondary: tokens.color.surfaceSecondary,
    
    // Text colors - High contrast and readable
    color: tokens.color.text,
    text: tokens.color.text,
    textSecondary: tokens.color.textSecondary,
    textTertiary: tokens.color.textTertiary,
    textMuted: tokens.color.textMuted,
    textInverse: tokens.color.textInverse,
    
    // Brand colors - Vibrant and accessible
    primary: tokens.color.primary,
    primaryLight: tokens.color.primaryLight,
    primaryDark: tokens.color.primaryDark,
    primarySubtle: tokens.color.primarySubtle,
    
    secondary: tokens.color.secondary,
    secondaryLight: tokens.color.secondaryLight,
    secondaryDark: tokens.color.secondaryDark,
    secondarySubtle: tokens.color.secondarySubtle,
    
    accent: tokens.color.accent,
    accentLight: tokens.color.accentLight,
    accentDark: tokens.color.accentDark,
    accentSubtle: tokens.color.accentSubtle,
    
    // Border colors - Subtle and consistent
    border: tokens.color.border,
    borderSubtle: tokens.color.borderSubtle,
    borderFocus: tokens.color.borderFocus,
    
    // Status colors - Clear and meaningful
    success: tokens.color.success,
    successLight: tokens.color.successLight,
    successSubtle: tokens.color.successSubtle,
    
    warning: tokens.color.warning,
    warningLight: tokens.color.warningLight,
    warningSubtle: tokens.color.warningSubtle,
    
    error: tokens.color.error,
    errorLight: tokens.color.errorLight,
    errorSubtle: tokens.color.errorSubtle,
    
    info: tokens.color.info,
    infoLight: tokens.color.infoLight,
    infoSubtle: tokens.color.infoSubtle,
    
    // Glass and overlay effects
    glass: tokens.color.glass,
    glassSubtle: tokens.color.glassSubtle,
    glassStrong: tokens.color.glassStrong,
    glassAccent: tokens.color.glassAccent,
    glassSecondary: tokens.color.glassSecondary,
    overlay: tokens.color.overlay,
  },
  dark: {
    // Background colors - Deep and rich
    background: tokens.color.backgroundDark,
    backgroundElevated: tokens.color.surfaceElevatedDark, // For compatibility
    backgroundSecondary: tokens.color.backgroundSecondaryDark,
    backgroundTertiary: tokens.color.backgroundTertiaryDark,
    surface: tokens.color.surfaceDark,
    surfaceElevated: tokens.color.surfaceElevatedDark,
    surfaceSecondary: tokens.color.surfaceSecondaryDark,
    
    // Text colors - Optimized for dark backgrounds
    color: tokens.color.textDark,
    text: tokens.color.textDark,
    textSecondary: tokens.color.textSecondaryDark,
    textTertiary: tokens.color.textTertiaryDark,
    textMuted: tokens.color.textMutedDark,
    textInverse: tokens.color.textInverseDark,
    
    // Brand colors - Lighter variants for dark backgrounds
    primary: tokens.color.primaryDark,
    primaryLight: tokens.color.primaryLightDark,
    primaryDark: tokens.color.primaryDarkDark,
    primarySubtle: tokens.color.primarySubtleDark,
    
    secondary: tokens.color.secondaryDark,
    secondaryLight: tokens.color.secondaryLightDark,
    secondaryDark: tokens.color.secondaryDarkDark,
    secondarySubtle: tokens.color.secondarySubtleDark,
    
    accent: tokens.color.accentDark,
    accentLight: tokens.color.accentLightDark,
    accentDark: tokens.color.accentDarkDark,
    accentSubtle: tokens.color.accentSubtleDark,
    
    // Border colors - Visible but not harsh
    border: tokens.color.borderDark,
    borderSubtle: tokens.color.borderSubtleDark,
    borderFocus: tokens.color.borderFocusDark,
    
    // Status colors - Dark theme optimized
    success: tokens.color.successDarkTheme,
    successLight: tokens.color.successLightDarkTheme,
    successSubtle: tokens.color.successSubtleDarkTheme,
    
    warning: tokens.color.warningDarkTheme,
    warningLight: tokens.color.warningLightDarkTheme,
    warningSubtle: tokens.color.warningSubtleDarkTheme,
    
    error: tokens.color.errorDarkTheme,
    errorLight: tokens.color.errorLightDarkTheme,
    errorSubtle: tokens.color.errorSubtleDarkTheme,
    
    info: tokens.color.infoDarkTheme,
    infoLight: tokens.color.infoLightDarkTheme,
    infoSubtle: tokens.color.infoSubtleDarkTheme,
    
    // Glass and overlay effects for dark theme
    glass: tokens.color.glassDark,
    glassSubtle: tokens.color.glassSubtleDark,
    glassStrong: tokens.color.glassStrongDark,
    glassAccent: tokens.color.glassAccentDark,
    glassSecondary: tokens.color.glassSecondaryDark,
    overlay: tokens.color.overlayDark,
  },
}
