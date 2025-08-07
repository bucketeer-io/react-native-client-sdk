// Jest setup configuration
// eslint-disable-next-line no-undef
jest.mock('@react-native-async-storage/async-storage', () => {
  const mockAsyncStorage = require('@react-native-async-storage/async-storage/jest/async-storage-mock');
  return {
    default: mockAsyncStorage,
    ...mockAsyncStorage,
  };
});
