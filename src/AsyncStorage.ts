/**
 * The Bucketeer React-Native SDK uses
 * @react-native-async-storage/async-storage for bootstrapping. This is a native
 * dependency.
 *
 * If you are using expo, then adding the Bucketeer React Native
 * SDK from npm and re-running pod install should suffice.
 *
 * If you are not using expo, you will need to explicitly add
 * @react-native-async-storage/async-storage as a dependency to your project
 * and re-run pod install for auto-linking to work. This is because auto-link
 * does not work with transitive dependencies:
 * https://github.com/react-native-community/cli/issues/1347
 *
 */
import type { BKTStorage } from '@bucketeer/js-client-sdk';

interface AsyncStorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

class BKTAsyncStorageError extends Error {
  constructor(
    message: string,
    public key: string,
    public operation: string
  ) {
    super(message);
    this.name = 'BKTStorageError';
  }
}

class BKTAsyncKeyValueStore<T> implements BKTStorage<T> {
  private asyncStorage: AsyncStorageInterface;

  constructor(
    private key: string,
    asyncStorage: AsyncStorageInterface
  ) {
    this.asyncStorage = asyncStorage;
  }

  async set(value: T | null): Promise<void> {
    try {
      if (value === null) {
        await this.asyncStorage.removeItem(this.key);
      } else {
        await this.asyncStorage.setItem(this.key, JSON.stringify(value));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BKTAsyncStorageError(
        `Failed to set value for key "${this.key}": ${message}`,
        this.key,
        'set'
      );
    }
  }

  async get(): Promise<T | null> {
    try {
      const item = await this.asyncStorage.getItem(this.key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BKTAsyncStorageError(
        `Failed to get value for key "${this.key}": ${message}`,
        this.key,
        'get'
      );
    }
  }

  async clear(): Promise<void> {
    try {
      await this.asyncStorage.removeItem(this.key);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BKTAsyncStorageError(
        `Failed to clear value for key "${this.key}": ${message}`,
        this.key,
        'clear'
      );
    }
  }
}

function createReactNativeStorageFactory():
  | (<T>(key: string) => BKTStorage<T>)
  | undefined {
  try {
    // Check if AsyncStorage is available
    const AsyncStorage =
      require('@react-native-async-storage/async-storage').default;

    if (!AsyncStorage) {
      return undefined;
    }

    // Return factory that creates AsyncKeyValueStore with AsyncStorage
    return <T>(key: string): BKTStorage<T> => {
      return new BKTAsyncKeyValueStore<T>(key, AsyncStorage);
    };
  } catch (error) {
    console.warn(
      'AsyncStorage is not available. ' +
        'This likely means that @react-native-async-storage/async-storage is not installed or not properly linked. ' +
        'If you are using Expo, try re-installing the Bucketeer React Native SDK and re-running "pod install". ' +
        'If you are not using Expo, ensure that @react-native-async-storage/async-storage is added as a dependency and run "pod install" for auto-linking. ' +
        'See https://github.com/react-native-async-storage/async-storage and the SDK documentation for more information.'
    );
    return undefined;
  }
}

export {
  createReactNativeStorageFactory,
  BKTAsyncStorageError,
  BKTAsyncKeyValueStore,
};
