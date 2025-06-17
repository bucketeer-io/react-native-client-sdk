import { defineBKTConfig } from 'bkt-js-client-sdk';
import type { BKTConfig, RawBKTConfig } from 'bkt-js-client-sdk';
import uuid from 'react-native-uuid';
import { SDK_VERSION } from './version';
import { SOURCE_ID_REACT_NATIVE } from './SourceId';

export * from 'bkt-js-client-sdk';
export * from 'bkt-react-client-sdk';

export function defineReactNativeBKTConfig(config: RawBKTConfig): BKTConfig {
  return defineBKTConfig({
    ...config,
    idGenerator: new ReactNativeIdGenerator(),
    // Set this to undefined to use the default in-memory storage
    storageFactory: undefined,
    wrapperSdkSourceId: SOURCE_ID_REACT_NATIVE,
    wrapperSdkVersion: SDK_VERSION,
    userAgent: `Bucketeer React Native SDK(${SDK_VERSION})`,
  });
}

class ReactNativeIdGenerator {
  newId(): string {
    return uuid.v4();
  }
}
