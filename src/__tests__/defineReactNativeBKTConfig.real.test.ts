import { defineReactNativeBKTConfig } from '../index';
import { SOURCE_ID_REACT_NATIVE } from '../SourceId';
import { SDK_VERSION } from '../version';
import { ReactNativeIdGenerator } from '../IdGenerator';

describe('defineReactNativeBKTConfig - Real implementation', () => {
  const baseConfig = {
    apiKey: 'test-key',
    apiEndpoint: 'https://api.example.com',
    appVersion: '1.0.0',
    featureTag: 'test',
  };

  it('should set idGenerator, wrapperSdkSourceId, and wrapperSdkVersion correctly', () => {
    const config = defineReactNativeBKTConfig(baseConfig);
    expect(config.idGenerator).toBeDefined();
    // idGenerator should be an instance of ReactNativeIdGenerator
    expect(config.idGenerator).toBeInstanceOf(ReactNativeIdGenerator);
    expect(config.wrapperSdkSourceId).toBe(SOURCE_ID_REACT_NATIVE);
    expect(config.wrapperSdkVersion).toBe(SDK_VERSION);
    expect(config.userAgent).toBe(`Bucketeer React Native SDK(${SDK_VERSION})`);
    const { sourceId, sdkVersion } = config as unknown as {
      // internal fields
      sdkVersion: string;
      sourceId: number;
    };
    // Should override with React-specific values
    expect(sourceId).toBe(SOURCE_ID_REACT_NATIVE);
    expect(sdkVersion).toBe(SDK_VERSION);
  });
});
