import { defineBKTConfigForReactNative } from '../index';
import { SOURCE_ID_REACT_NATIVE } from '../SourceId';
import { SDK_VERSION } from '../version';
import { ReactNativeIdGenerator } from '../IdGenerator';
import { BKTAsyncKeyValueStore } from '../AsyncStorage';

describe('defineBKTConfigForReactNative - Real implementation', () => {
  const baseConfig = {
    apiKey: 'test-key',
    apiEndpoint: 'https://api.example.com',
    appVersion: '1.0.0',
    featureTag: 'test',
  };

  it('should set storageFactory, idGenerator, wrapperSdkSourceId, and wrapperSdkVersion correctly', () => {
    const config = defineBKTConfigForReactNative(baseConfig);
    expect(config.idGenerator).toBeDefined();
    // idGenerator should be an instance of ReactNativeIdGenerator
    expect(config.idGenerator).toBeInstanceOf(ReactNativeIdGenerator);
    expect(config.wrapperSdkSourceId).toBe(SOURCE_ID_REACT_NATIVE);
    expect(config.wrapperSdkVersion).toBe(SDK_VERSION);
    expect(config.userAgent).toContain(
      `Bucketeer React Native SDK(${SDK_VERSION})`
    );
    const { sourceId, sdkVersion } = config as unknown as {
      // internal fields
      sdkVersion: string;
      sourceId: number;
    };
    // Should override with React-specific values
    expect(sourceId).toBe(SOURCE_ID_REACT_NATIVE);
    expect(sdkVersion).toBe(SDK_VERSION);
    // Should have storageFactory defined
    const storageFactory = config.storageFactory;
    const store = storageFactory('test-key');
    expect(store).toBeDefined();
    expect(store).toBeInstanceOf(BKTAsyncKeyValueStore);
    // check if store implements BKTStorage interface
    expect(typeof store.set).toBe('function');
    expect(typeof store.get).toBe('function');
    expect(typeof store.clear).toBe('function');
  });

  // Should have default storageFactory even if AsyncStorage is not available
  it('should handle undefined storageFactory gracefully', () => {
    jest.resetModules();
    jest.unmock('@react-native-async-storage/async-storage');
    const config = defineBKTConfigForReactNative(baseConfig);
    expect(config.storageFactory).toBeDefined();
    expect(typeof config.storageFactory).toBe('function');
    const store = config.storageFactory('test-key');
    expect(store).toBeDefined();
    // storage should return an internal class InMemoryStorage
    expect(store).not.toBeInstanceOf(BKTAsyncKeyValueStore);
    // check if it implements BKTStorage interface
    expect(typeof store.set).toBe('function');
    expect(typeof store.get).toBe('function');
    expect(typeof store.clear).toBe('function');
  });
});
