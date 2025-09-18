const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = getDefaultConfig(__dirname);
  config.resolver.nodeModulesPath = [__dirname + "/node_modules"];
  return config;
})();