const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for @ alias
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    '@': path.resolve(__dirname, 'src'),
  },
};

module.exports = config;
