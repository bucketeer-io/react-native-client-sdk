import { createReactNativeStorageFactory } from '../AsyncStorage';

describe('createReactNativeStorageFactory', () => {
  it('should return a factory function when AsyncStorage is available', () => {
    jest.resetModules();
    const factory = createReactNativeStorageFactory();
    expect(typeof factory).toBe('function');
    if (factory) {
      const store = factory('test-key');
      expect(store).toBeDefined();
      expect(typeof store.set).toBe('function');
      expect(typeof store.get).toBe('function');
      expect(typeof store.clear).toBe('function');
    }
  });

  it('should return undefined when AsyncStorage is not available', () => {
    jest.resetModules();
    jest.unmock('@react-native-async-storage/async-storage');
    const factory = createReactNativeStorageFactory();
    expect(factory).toBeUndefined();
  });
});
