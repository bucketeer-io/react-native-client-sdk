/**
 * Jest mocking approaches explained:
 *
 * 1. Top-level jest.mock (BEST PRACTICE for React web/ESM projects):
 *    - Place jest.mock('module', ...) at the top of the file (outside any block).
 *    - Jest hoists this call, so the mock is applied before any imports.
 *    - You can use import statements as usual.
 *    - Works with ESM (modern React web projects) and is the recommended approach.
 *    - Example:
 *        jest.mock('bkt-js-client-sdk', () => ({ ... }));
 *        import { defineBKTConfig } from 'bkt-js-client-sdk';
 *
 * 2. jest.doMock + require (CommonJS/React Native):
 *    - Call jest.doMock('module', ...) inside a test or block.
 *    - The mock only affects modules loaded after the call.
 *    - You must use require (not import) after the mock to get the mocked version.
 *    - This works in CommonJS environments (like React Native or Node.js projects using Jest's default config).
 *    - Example:
 *        jest.doMock('bkt-js-client-sdk', ...);
 *        const { defineBKTConfig } = require('bkt-js-client-sdk');
 *
 * Summary:
 * - For React web/ESM: Use top-level jest.mock and import (best practice).
 * - For React Native/CommonJS: You can use jest.doMock + require for dynamic mocking.
 * - Both approaches let you mock dependencies, but the timing and module system differ.
 */

import { defineReactNativeBKTConfig } from '../index';
import { SOURCE_ID_REACT_NATIVE } from '../SourceId';
import { SDK_VERSION } from '../version';

describe('defineReactNativeBKTConfig', () => {
  const baseConfig = {
    apiKey: 'test-key',
    apiEndpoint: 'https://api.example.com',
    appVersion: '1.0.0',
    featureTag: 'test',
  };

  afterEach(() => {
    jest.resetModules();
  });

  it('should set idGenerator, wrapperSdkSourceId, and wrapperSdkVersion correctly', () => {
    const config = defineReactNativeBKTConfig(baseConfig);
    expect(config.idGenerator).toBeDefined();
    expect(typeof (config.idGenerator as any).newId).toBe('function');
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

  it('should call defineBKTConfig with all required config fields', () => {
    const mockDefineBKTConfig = jest.fn((cfg) => ({ ...cfg }));
    jest.doMock('bkt-js-client-sdk', () => ({
      defineBKTConfig: mockDefineBKTConfig,
    }));
    // Re-require after mocking
    const {
      defineReactNativeBKTConfig: defineReactNativeBKTConfigMocked,
    } = require('../index');
    defineReactNativeBKTConfigMocked(baseConfig);
    expect(mockDefineBKTConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        ...baseConfig,
        idGenerator: expect.any(Object),
        storageFactory: undefined,
        wrapperSdkSourceId: SOURCE_ID_REACT_NATIVE,
        wrapperSdkVersion: SDK_VERSION,
        userAgent: `Bucketeer React Native SDK(${SDK_VERSION})`,
      })
    );
  });
});
