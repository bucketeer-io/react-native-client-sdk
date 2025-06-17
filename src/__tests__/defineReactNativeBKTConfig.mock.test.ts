jest.mock('bkt-js-client-sdk', () => ({
  defineBKTConfig: jest.fn(),
}));

import { defineReactNativeBKTConfig } from '../index';
import { SOURCE_ID_REACT_NATIVE } from '../SourceId';
import { SDK_VERSION } from '../version';

// Get the mocked function after imports
const { defineBKTConfig } = jest.requireMock('bkt-js-client-sdk');
const mockDefineBKTConfig = defineBKTConfig as jest.MockedFunction<
  typeof defineBKTConfig
>;

describe('defineReactNativeBKTConfig - mock defineBKTConfig', () => {
  const baseConfig = {
    apiKey: 'test-key',
    apiEndpoint: 'https://api.example.com',
    appVersion: '1.0.0',
    featureTag: 'test',
  };

  beforeEach(() => {
    mockDefineBKTConfig.mockClear();
    mockDefineBKTConfig.mockImplementation((cfg: any) => ({ ...cfg }));
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should call defineBKTConfig with all required config fields', () => {
    defineReactNativeBKTConfig(baseConfig);
    expect(mockDefineBKTConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        ...baseConfig,
        idGenerator: expect.any(Object),
        wrapperSdkSourceId: SOURCE_ID_REACT_NATIVE,
        wrapperSdkVersion: SDK_VERSION,
        userAgent: `Bucketeer React Native SDK(${SDK_VERSION})`,
      })
    );
  });
});
