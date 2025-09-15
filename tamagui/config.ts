import { createTamagui } from '@tamagui/core';
import { tokens } from './tokens';
import { themes } from './themes';
// Ensure themes is a flat object: { light: { background: '', text: '', ... }, dark: { background: '', text: '', ... } }
import { shorthands } from './shorthands';

export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: {
      background: '#fff',
      text: '#000',
      primary: '#007aff',
      secondary: '#5856d6',
      border: '#d1d1d6',
    },
    dark: {
      background: '#000',
      text: '#fff',
      primary: '#0a84ff',
      secondary: '#5e5ce6',
      border: '#3a3a3c',
    },
  },
  shorthands,
  fonts: {
    heading: {
      family: 'System',
      size: { 1: 20, 2: 24, 3: 32 },
      weight: { 1: '700', 2: '800' },
      letterSpacing: { 1: 0, 2: 0.5 },
    },
    body: {
      family: 'System',
      size: { 1: 16, 2: 18 },
      weight: { 1: '400', 2: '500' },
      letterSpacing: { 1: 0, 2: 0.25 },
    },
  },
});
