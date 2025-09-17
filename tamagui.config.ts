import { createTamagui } from '@tamagui/core';
import { config as baseConfig } from '@tamagui/config';
import { tokens } from './tamagui/tokens';
import { shorthands } from './tamagui/shorthands';

// Merge custom tokens, themes, and shorthands with the base config
const tamaguiConfig = createTamagui({
  ...baseConfig,
  tokens: {
    ...baseConfig.tokens,
    ...tokens,
  },
  themes: {
    ...baseConfig.themes,
    // Optionally override or add custom themes here
  },
  shorthands: {
    ...baseConfig.shorthands,
    ...shorthands,
  },
  fonts: {
    ...baseConfig.fonts,
    // Optionally override or add custom fonts here
  },
});

export default tamaguiConfig;