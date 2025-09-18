module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@api': './src/api',
          '@components': './src/components',
          '@features': './src/features',
          '@hooks': './src/hooks',
          '@theme': './src/theme',
          '@utils': './src/utils',
        },
      }],
    ],
  };
};
