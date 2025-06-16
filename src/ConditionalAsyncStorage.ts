/**
 * The Buckeeteer React-Native SDK uses
 * @react-native-async-storage/async-storage for bootstrapping. This is a native
 * dependency.
 *
 * If you are using expo, then adding the Buckeeteer React Native
 * SDK from npm and re-running pod install should suffice.
 *
 * If you are not using expo, you will need to explicitly add
 * @react-native-async-storage/async-storage as a dependency to your project
 * and re-run pod install for auto-linking to work. This is because auto-link
 * does not work with transitive dependencies:
 * https://github.com/react-native-community/cli/issues/1347
 *
 */
// let ConditionalAsyncStorage: any;

import type { BKTStorage } from 'bkt-js-client-sdk';

export class InMemoryStorage<T> implements BKTStorage<T> {
  private cache: Record<string, T | null> = {};
  private asyncStorage: any;

  constructor(
    private key: string,
    asyncStorage: any
  ) {
    this.asyncStorage = asyncStorage;

    // Pre-load from async storage if available
    this.loadFromAsyncStorage();
  }

  set(value: T | null): void {
    // Update in-memory cache immediately
    this.cache[this.key] = value;

    // Auto-sync to async storage (fire and forget)
    this.syncToAsyncStorage();
  }

  get(): T | null {
    return this.cache[this.key] ?? null;
  }

  clear(): void {
    // Clear from in-memory cache immediately
    delete this.cache[this.key];

    // Auto-sync clear to async storage (fire and forget)
    this.syncClearToAsyncStorage();
  }

  private async loadFromAsyncStorage(): Promise<void> {
    try {
      const value = await this.asyncStorage.getItem(this.key);
      if (value !== null) {
        this.cache[this.key] = JSON.parse(value);
      }
    } catch {
      // Ignore errors - in-memory storage will work fine
    }
  }

  private syncToAsyncStorage(): void {
    const value = this.cache[this.key];
    this.asyncStorage.setItem(this.key, JSON.stringify(value)).catch(() => {
      // Ignore errors - in-memory storage still works
    });
  }

  private syncClearToAsyncStorage(): void {
    this.asyncStorage.removeItem(this.key).catch(() => {
      // Ignore errors - in-memory storage still works
    });
  }
}

function createReactNativeStorageFactory():
  | (<T>(key: string) => BKTStorage<T>)
  | undefined {
  try {
    // Try to require AsyncStorage directly instead of circular dependency
    const AsyncStorage =
      require('@react-native-async-storage/async-storage').default;

    if (!AsyncStorage) {
      return undefined;
    }

    // Return factory that creates InMemoryStorage with AsyncStorage sync
    return <T>(key: string): BKTStorage<T> => {
      return new InMemoryStorage<T>(key, AsyncStorage);
    };
  } catch (error) {
    console.warn('AsyncStorage not available:', error);
    return undefined;
  }
}

export { createReactNativeStorageFactory };
