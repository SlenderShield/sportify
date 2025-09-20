module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/store': './src/store',
            '@/utils': './src/utils',
            '@/types': './src/types',
            '@/hooks': './src/hooks',
            '@/services': './src/services',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
