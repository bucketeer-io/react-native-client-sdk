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
    // Unset storageFactory if AsyncStorage is not available
    // This will cause the SDK to use an in-memory storage implementation (refs: JS-SDK)
    console.warn(
      'No storage factory available. Bucketeer React Native SDK will not have persistent storage.'
    );
  }
  const result = defineBKTConfig(inputConfig);
  return result;
}
