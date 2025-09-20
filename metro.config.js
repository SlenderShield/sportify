const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for path aliases
config.resolver.alias = {
  '@': './src',
  '@/components': './src/components',
  '@/screens': './src/screens',
  '@/store': './src/store',
  '@/utils': './src/utils',
  '@/types': './src/types',
  '@/hooks': './src/hooks',
  '@/services': './src/services',
};

module.exports = config;
