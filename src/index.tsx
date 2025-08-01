import { defineBKTConfig } from '@bucketeer/react-client-sdk';
import type { BKTConfig, RawBKTConfig } from '@bucketeer/react-client-sdk';
import { SDK_VERSION } from './version';
import { SOURCE_ID_REACT_NATIVE } from './SourceId';
import { ReactNativeIdGenerator } from './IdGenerator';
import { createReactNativeStorageFactory } from './AsyncStorage';

export * from '@bucketeer/react-client-sdk';

export function defineBKTConfigForReactNative(config: RawBKTConfig): BKTConfig {
  return defineBKTConfig({
    ...config,
    idGenerator: new ReactNativeIdGenerator(),
    // Set this to undefined to use the default in-memory storage
    wrapperSdkSourceId: SOURCE_ID_REACT_NATIVE,
    wrapperSdkVersion: SDK_VERSION,
    userAgent: `Bucketeer React Native SDK(${SDK_VERSION})`,
    storageFactory: createReactNativeStorageFactory(),
  });
}
