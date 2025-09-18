// Load environment variables (if needed)
require('dotenv/config');

module.exports = {
  expo: {
    name: "sportify",
    slug: "sportify",
    jsEngine: "jsc",
    userInterfaceStyle: "automatic",
    "web": {
      "bundler": "metro"
    },
    plugins: [
      "expo-secure-store"
    ],
  },
};
