const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(
  {
    ...config,
    watchFolders: [path.resolve(__dirname, 'app')],
  },
  {
    input: './global.css'
  }
);