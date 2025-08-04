import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BKTAsyncStorageError,
  BKTAsyncKeyValueStore,
  createReactNativeStorageFactory,
} from '../AsyncStorage';

/**
 * UNIT TESTS for BKTAsyncKeyValueStore and BKTAsyncStorageError
 *
 * Purpose: Test the business logic and behavior of storage classes using
 * the Jest-mocked AsyncStorage from React Native.
 *
 * These tests verify:
 * 1. Data storage, retrieval, and serialization logic
 * 2. Error handling for various failure scenarios
 * 3. Support for different data types (string, number, object, array)
 * 4. Edge cases (null values, invalid JSON, storage failures)
 * 5. Factory function behavior and AsyncStorage method calls
 *
 * Uses Jest-mocked AsyncStorage (configured in jest.setup.js)
 * https://react-native-async-storage.github.io/async-storage/docs/advanced/jest
 */

describe('createReactNativeStorageFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a factory function when AsyncStorage is available', () => {
    const factory = createReactNativeStorageFactory();
    expect(typeof factory).toBe('function');
  });

  it('should create storage instances with correct methods', () => {
    const factory = createReactNativeStorageFactory();
    if (!factory) return;

    const store = factory('test-key');
    expect(store).toBeDefined();
    expect(typeof store.set).toBe('function');
    expect(typeof store.get).toBe('function');
    expect(typeof store.clear).toBe('function');
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

  it('should return undefined when AsyncStorage is not available', () => {
    jest.resetModules();
    jest.unmock('@react-native-async-storage/async-storage');
    const factory = createReactNativeStorageFactory();
    expect(factory).toBeUndefined();
  });
});

describe('BKTAsyncStorageError', () => {
  it('should create error with correct properties', () => {
    const error = new BKTAsyncStorageError('Test message', 'testKey', 'set');

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test message');
    expect(error.key).toBe('testKey');
    expect(error.operation).toBe('set');
    expect(error.name).toBe('BKTStorageError');
  });

  it('should extend Error correctly', () => {
    const error = new BKTAsyncStorageError('Test message', 'testKey', 'get');

    expect(error instanceof Error).toBe(true);
    expect(error instanceof BKTAsyncStorageError).toBe(true);
  });
});

describe('BKTAsyncKeyValueStore', () => {
  let storage: BKTAsyncKeyValueStore<{ value: string }>;
  const testKey = 'test-key';

  beforeEach(() => {
    jest.clearAllMocks();
    storage = new BKTAsyncKeyValueStore(testKey, AsyncStorage);
  });

  describe('set', () => {
    it('should call AsyncStorage.setItem with JSON.stringify value', async () => {
      const testValue = { value: 'test data' };

      await storage.set(testValue);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(testValue)
      );
    });

    it('should call AsyncStorage.removeItem when value is null', async () => {
      await storage.set(null);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(testKey);
    });

    it('should throw BKTAsyncStorageError when setItem fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error('setItem failed')
      );

      await expect(storage.set({ value: 'test' })).rejects.toThrow(
        BKTAsyncStorageError
      );

      try {
        await storage.set({ value: 'test' });
      } catch (error) {
        expect(error).toBeInstanceOf(BKTAsyncStorageError);
        if (error instanceof BKTAsyncStorageError) {
          expect(error.key).toBe(testKey);
          expect(error.operation).toBe('set');
          expect(error.message).toContain('Failed to set value for key');
          expect(error.message).toContain('setItem failed');
        }
      }
    });

    it('should throw BKTAsyncStorageError when removeItem fails', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error('removeItem failed')
      );

      await expect(storage.set(null)).rejects.toThrow(BKTAsyncStorageError);

      try {
        await storage.set(null);
      } catch (error) {
        expect(error).toBeInstanceOf(BKTAsyncStorageError);
        if (error instanceof BKTAsyncStorageError) {
          expect(error.key).toBe(testKey);
          expect(error.operation).toBe('set');
          expect(error.message).toContain('removeItem failed');
        }
      }
    });
  });

  describe('get', () => {
    it('should return parsed value when AsyncStorage returns data', async () => {
      const testValue = { value: 'test data' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(testValue)
      );

      const result = await storage.get();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(testKey);
      expect(result).toEqual(testValue);
    });

    it('should return null when AsyncStorage returns null', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await storage.get();

      expect(result).toBeNull();
    });

    it('should throw BKTAsyncStorageError when getItem fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('getItem failed')
      );

      await expect(storage.get()).rejects.toThrow(BKTAsyncStorageError);

      try {
        await storage.get();
      } catch (error) {
        expect(error).toBeInstanceOf(BKTAsyncStorageError);
        if (error instanceof BKTAsyncStorageError) {
          expect(error.key).toBe(testKey);
          expect(error.operation).toBe('get');
          expect(error.message).toContain('Failed to get value for key');
          expect(error.message).toContain('getItem failed');
        }
      }
    });

    it('should throw BKTAsyncStorageError when JSON.parse fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');

      await expect(storage.get()).rejects.toThrow(BKTAsyncStorageError);

      try {
        await storage.get();
      } catch (error) {
        expect(error).toBeInstanceOf(BKTAsyncStorageError);
        if (error instanceof BKTAsyncStorageError) {
          expect(error.key).toBe(testKey);
          expect(error.operation).toBe('get');
          expect(error.message).toContain('Failed to get value for key');
        }
      }
    });
  });

  describe('clear', () => {
    it('should call AsyncStorage.removeItem', async () => {
      await storage.clear();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(testKey);
    });

    it('should throw BKTAsyncStorageError when removeItem fails', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error('removeItem failed')
      );

      await expect(storage.clear()).rejects.toThrow(BKTAsyncStorageError);

      try {
        await storage.clear();
      } catch (error) {
        expect(error).toBeInstanceOf(BKTAsyncStorageError);
        if (error instanceof BKTAsyncStorageError) {
          expect(error.key).toBe(testKey);
          expect(error.operation).toBe('clear');
          expect(error.message).toContain('Failed to clear value for key');
          expect(error.message).toContain('removeItem failed');
        }
      }
    });
  });

  describe('different data types', () => {
    it('should handle strings correctly', async () => {
      const stringStorage = new BKTAsyncKeyValueStore<string>(
        'string-key',
        AsyncStorage
      );
      const testValue = 'test string';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(testValue)
      );

      await stringStorage.set(testValue);
      const result = await stringStorage.get();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'string-key',
        JSON.stringify(testValue)
      );
      expect(result).toBe(testValue);
    });

    it('should handle numbers correctly', async () => {
      const numberStorage = new BKTAsyncKeyValueStore<number>(
        'number-key',
        AsyncStorage
      );
      const testValue = 42;

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(testValue)
      );

      await numberStorage.set(testValue);
      const result = await numberStorage.get();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'number-key',
        JSON.stringify(testValue)
      );
      expect(result).toBe(testValue);
    });

    it('should handle arrays correctly', async () => {
      const arrayStorage = new BKTAsyncKeyValueStore<number[]>(
        'array-key',
        AsyncStorage
      );
      const testValue = [1, 2, 3];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(testValue)
      );

      await arrayStorage.set(testValue);
      const result = await arrayStorage.get();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'array-key',
        JSON.stringify(testValue)
      );
      expect(result).toEqual(testValue);
    });

    it('should handle complex objects correctly', async () => {
      const objectStorage = new BKTAsyncKeyValueStore<{
        name: string;
        age: number;
        tags: string[];
      }>('object-key', AsyncStorage);

      const complexObject = {
        name: 'John',
        age: 30,
        tags: ['developer', 'javascript'],
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(complexObject)
      );

      await objectStorage.set(complexObject);
      const result = await objectStorage.get();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'object-key',
        JSON.stringify(complexObject)
      );
      expect(result).toEqual(complexObject);
    });
  });
});
