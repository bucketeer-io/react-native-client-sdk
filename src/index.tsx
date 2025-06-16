import { defineBKTConfig } from 'bkt-js-client-sdk';
import type { BKTConfig, RawBKTConfig } from 'bkt-js-client-sdk';
import { version } from 'react';
import uuid from 'react-native-uuid';

export * from 'bkt-js-client-sdk';

const SOURCE_ID_REACT_NATIVE = 10;

export function defineReactNativeBKTConfig(config: RawBKTConfig): BKTConfig {
  return defineBKTConfig({
    ...config,
    idGenerator: new ReactNativeIdGenerator(),
    // Set this to undefined to use the default in-memory storage
    storageFactory: undefined,
    wrapperSdkSourceId: SOURCE_ID_REACT_NATIVE,
    wrapperSdkVersion: version,
  });
}

class ReactNativeIdGenerator {
  newId(): string {
    return uuid.v4();
  }
}
