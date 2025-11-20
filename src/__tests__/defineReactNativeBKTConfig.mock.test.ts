jest.mock('@bucketeer/react-client-sdk', () => ({
  defineBKTConfig: jest.fn(),
}));

import { BKTAsyncKeyValueStore } from '../AsyncStorage';
import { defineBKTConfigForReactNative } from '../index';
import { SOURCE_ID_REACT_NATIVE } from '../SourceId';
import { SDK_VERSION } from '../version';

// Get the mocked function after imports
const { defineBKTConfig } = jest.requireMock('@bucketeer/react-client-sdk');
const mockDefineBKTConfig = defineBKTConfig as jest.MockedFunction<
  typeof defineBKTConfig
>;

jest.mock('../Platform', () => ({
  getCurrentPlatform: jest.fn(() => ({
    os: 'iOS',
    version: '14.0',
  })),
}));

const baseConfig = {
  apiKey: 'test-key',
  apiEndpoint: 'https://api.example.com',
  appVersion: '1.0.0',
  featureTag: 'test',
};

describe('defineBKTConfigForReactNative - mock defineBKTConfig', () => {
  beforeEach(() => {
    mockDefineBKTConfig.mockClear();
    mockDefineBKTConfig.mockImplementation((cfg: any) => ({ ...cfg }));
  });

  it('should call defineBKTConfig with all required config fields', () => {
    defineBKTConfigForReactNative(baseConfig);
    expect(mockDefineBKTConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        ...baseConfig,
        idGenerator: expect.any(Object),
        wrapperSdkSourceId: SOURCE_ID_REACT_NATIVE,
        wrapperSdkVersion: SDK_VERSION,
        userAgent: `Bucketeer React Native SDK(${SDK_VERSION}) iOS/14.0`,
        storageFactory: expect.any(Function),
      })
    );
  });

  it('should use valid factory function when createReactNativeStorageFactory returns a function', () => {
    defineBKTConfigForReactNative(baseConfig);

    expect(mockDefineBKTConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        storageFactory: expect.any(Function),
      })
    );

    // Verify the storageFactory is actually a function
    const callArgs = mockDefineBKTConfig.mock.calls[0][0];
    expect(typeof callArgs.storageFactory).toBe('function');

    // Test that the factory creates storage instances
    const storage = callArgs.storageFactory('test-key');
    expect(storage).toBeInstanceOf(BKTAsyncKeyValueStore);
    expect(storage).toHaveProperty('set');
    expect(storage).toHaveProperty('get');
    expect(storage).toHaveProperty('clear');
  });

  it('should handle undefined when createReactNativeStorageFactory returns undefined', () => {
    // Mock createReactNativeStorageFactory to return undefined using spyOn
    const AsyncStorageFactory = require('../AsyncStorageFactory');
    const createFactorySpy = jest
      .spyOn(AsyncStorageFactory, 'createReactNativeStorageFactory')
      .mockReturnValue(undefined);

    try {
      defineBKTConfigForReactNative(baseConfig);
      // Verify the storageFactory is undefined when createReactNativeStorageFactory returns undefined
      const callArgs = mockDefineBKTConfig.mock.calls[0][0];
      expect(callArgs.storageFactory).toBeUndefined();
    } finally {
      // Restore the original implementation
      createFactorySpy.mockRestore();
    }
  });
});
