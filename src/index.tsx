import { defineBKTConfig } from '@bucketeer/react-client-sdk';
import type { BKTConfig, RawBKTConfig } from '@bucketeer/react-client-sdk';
import { SDK_VERSION } from './version';
import { SOURCE_ID_REACT_NATIVE } from './SourceId';
import { ReactNativeIdGenerator } from './IdGenerator';
import { createReactNativeStorageFactory } from './AsyncStorageFactory';
import { getCurrentPlatform } from './Platform';

export * from '@bucketeer/react-client-sdk';

export function defineBKTConfigForReactNative(config: RawBKTConfig): BKTConfig {
  const platform = getCurrentPlatform();
  const storageFactory = createReactNativeStorageFactory();
  let inputConfig: RawBKTConfig = {
    ...config,
    idGenerator: new ReactNativeIdGenerator(),
    wrapperSdkSourceId: SOURCE_ID_REACT_NATIVE,
    wrapperSdkVersion: SDK_VERSION,
    userAgent: `Bucketeer React Native SDK(${SDK_VERSION}) ${platform.os}/${platform.version}`,
  };
  if (storageFactory) {
    inputConfig = {
      ...inputConfig,
      storageFactory,
    };
  } else {
    // Do not set storageFactory when AsyncStorage is not available
    // This allows the JS-SDK to fall back to its default in-memory storage implementation
    console.warn(
      'AsyncStorage is not available. Bucketeer React Native SDK will use in-memory storage without persistence.'
    );
  }
  const result = defineBKTConfig(inputConfig);
  return result;
}
