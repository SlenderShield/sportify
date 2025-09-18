// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',                // <-- NativeWind plugin
      'react-native-worklets/plugin',  // <-- if you use Reanimated
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@api': './src/api',
            '@components': './src/components',
            '@features': './src/features',
            '@hooks': './src/hooks',
            '@theme': './src/theme',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};
