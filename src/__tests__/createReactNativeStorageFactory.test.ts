import { createReactNativeStorageFactory } from '../AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * INTEGRATION TESTS for createReactNativeStorageFactory
 *
 * Purpose: Test the factory function and verify that the created storage instances
 * properly integrate with React Native's AsyncStorage.
 *
 * These tests verify:
 * 1. Factory function creation and availability
 * 2. Integration between BKTAsyncKeyValueStore and AsyncStorage
 * 3. Correct AsyncStorage method calls (setItem, getItem, removeItem)
 *
 * NOTE: This is NOT duplicate of AsyncStorage.test.ts
 * - AsyncStorage.test.ts = Unit tests (business logic with mock storage)
 * - This file = Integration tests (React Native AsyncStorage integration)
 * // https://react-native-async-storage.github.io/async-storage/docs/advanced/jest
 */

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

describe('BKTAsyncKeyValueStore should use AsyncStorage correctly', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call AsyncStorage.setItem with correct parameters when setting a value', async () => {
    const factory = createReactNativeStorageFactory();
    if (!factory) return;

    const store = factory('test-key');
    const testValue = 'test-value';

    await store.set(testValue);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify(testValue)
    );
  });

  it('should call AsyncStorage.getItem with correct key when getting a value', async () => {
    const factory = createReactNativeStorageFactory();
    if (!factory) return;

    const store = factory('test-key');

    await store.get();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should call AsyncStorage.removeItem with correct key when clearing', async () => {
    const factory = createReactNativeStorageFactory();
    if (!factory) return;

    const store = factory('test-key');

    await store.clear();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
  });
});
