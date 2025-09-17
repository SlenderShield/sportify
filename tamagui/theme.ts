import { tokens } from "./tokens"
export const themes = {
    light: {
      background: tokens.color.background,
      color: tokens.color.text,
      primary: tokens.color.primary,
      secondary: tokens.color.secondary,
      border: tokens.color.border,
    },
    dark: {
      background: tokens.color.backgroundDark,
      color: tokens.color.textDark,
      primary: tokens.color.primaryDark,
      secondary: tokens.color.secondaryDark,
      border: tokens.color.borderDark,
    },
  }