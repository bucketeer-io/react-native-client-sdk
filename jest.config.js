module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/demo/ExpoApp/node_modules',
    '<rootDir>/demo/ReactNativeApp/node_modules',
    '<rootDir>/lib/',
  ],
};
