module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: [
      // Remove reanimated plugin temporarily or configure it properly
      // ['react-native-reanimated/plugin'],
    ],
  };
};
