import { BKTAsyncStorageError, BKTAsyncKeyValueStore } from '../AsyncStorage';

/**
 * UNIT TESTS for BKTAsyncKeyValueStore and BKTAsyncStorageError
 *
 * Purpose: Test the business logic and behavior of storage classes in isolation
 * using custom mocks to simulate various scenarios.
 *
 * These tests verify:
 * 1. Data storage, retrieval, and serialization logic
 * 2. Error handling for various failure scenarios
 * 3. Support for different data types (string, number, object, array)
 * 4. Edge cases (null values, invalid JSON, storage failures)
 *
 * NOTE: This is NOT duplicate of createReactNativeStorageFactory.test.ts
 * - This file = Unit tests (business logic with custom mock storage)
 * - createReactNativeStorageFactory.test.ts = Integration tests (React Native AsyncStorage)
 */

// Create a mock implementation of AsyncStorageInterface
class MockAsyncStorage {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  // Test helper methods
  clear() {
    this.storage.clear();
  }

  has(key: string): boolean {
    return this.storage.has(key);
  }

  getAllKeys() {
    return Array.from(this.storage.keys());
  }
}

// Mock for testing error scenarios
class FailingAsyncStorage {
  async getItem(_key: string): Promise<string | null> {
    throw new Error('getItem failed');
  }

  async setItem(_key: string, _value: string): Promise<void> {
    throw new Error('setItem failed');
  }

  async removeItem(_key: string): Promise<void> {
    throw new Error('removeItem failed');
  }
}

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

describe('AsyncKeyValueStore', () => {
  let mockAsyncStorage: MockAsyncStorage;
  let storage: BKTAsyncKeyValueStore<{ value: string }>;
  const testKey = 'test-key';

  beforeEach(() => {
    mockAsyncStorage = new MockAsyncStorage();
    storage = new BKTAsyncKeyValueStore(testKey, mockAsyncStorage);
  });

  describe('set', () => {
    it('should store value using JSON.stringify', async () => {
      const testValue = { value: 'test data' };

      await storage.set(testValue);

      expect(mockAsyncStorage.has(testKey)).toBe(true);
      const storedValue = await mockAsyncStorage.getItem(testKey);
      expect(storedValue).toBe(JSON.stringify(testValue));
    });

    it('should remove item when value is null', async () => {
      // First set a value
      await storage.set({ value: 'test' });
      expect(mockAsyncStorage.has(testKey)).toBe(true);

      // Then set null
      await storage.set(null);

      expect(mockAsyncStorage.has(testKey)).toBe(false);
    });

    it('should throw BKTAsyncStorageError when setItem fails', async () => {
      const failingStorage = new BKTAsyncKeyValueStore(
        testKey,
        new FailingAsyncStorage()
      );

      await expect(failingStorage.set({ value: 'test' })).rejects.toThrow(
        BKTAsyncStorageError
      );

      try {
        await failingStorage.set({ value: 'test' });
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
      const failingStorage = new BKTAsyncKeyValueStore(
        testKey,
        new FailingAsyncStorage()
      );

      await expect(failingStorage.set(null)).rejects.toThrow(
        BKTAsyncStorageError
      );

      try {
        await failingStorage.set(null);
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
    it('should return parsed value when item exists', async () => {
      const testValue = { value: 'test data' };
      await mockAsyncStorage.setItem(testKey, JSON.stringify(testValue));

      const result = await storage.get();

      expect(result).toEqual(testValue);
    });

    it('should return null when item does not exist', async () => {
      const result = await storage.get();

      expect(result).toBeNull();
    });

    it('should throw BKTAsyncStorageError when getItem fails', async () => {
      const failingStorage = new BKTAsyncKeyValueStore(
        testKey,
        new FailingAsyncStorage()
      );

      await expect(failingStorage.get()).rejects.toThrow(BKTAsyncStorageError);

      try {
        await failingStorage.get();
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
      await mockAsyncStorage.setItem(testKey, 'invalid json');

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
    it('should remove item from storage', async () => {
      // First set a value
      await storage.set({ value: 'test' });
      expect(mockAsyncStorage.has(testKey)).toBe(true);

      // Then clear it
      await storage.clear();

      expect(mockAsyncStorage.has(testKey)).toBe(false);
    });

    it('should throw BKTAsyncStorageError when removeItem fails', async () => {
      const failingStorage = new BKTAsyncKeyValueStore(
        testKey,
        new FailingAsyncStorage()
      );

      await expect(failingStorage.clear()).rejects.toThrow(
        BKTAsyncStorageError
      );

      try {
        await failingStorage.clear();
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
        mockAsyncStorage
      );

      await stringStorage.set('test string');
      const result = await stringStorage.get();

      expect(result).toBe('test string');
    });

    it('should handle numbers correctly', async () => {
      const numberStorage = new BKTAsyncKeyValueStore<number>(
        'number-key',
        mockAsyncStorage
      );

      await numberStorage.set(42);
      const result = await numberStorage.get();

      expect(result).toBe(42);
    });

    it('should handle arrays correctly', async () => {
      const arrayStorage = new BKTAsyncKeyValueStore<number[]>(
        'array-key',
        mockAsyncStorage
      );

      await arrayStorage.set([1, 2, 3]);
      const result = await arrayStorage.get();

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle complex objects correctly', async () => {
      const objectStorage = new BKTAsyncKeyValueStore<{
        name: string;
        age: number;
        tags: string[];
      }>('object-key', mockAsyncStorage);

      const complexObject = {
        name: 'John',
        age: 30,
        tags: ['developer', 'javascript'],
      };
      await objectStorage.set(complexObject);
      const result = await objectStorage.get();

      expect(result).toEqual(complexObject);
    });
  });
});
