import {
  BucketeerProvider,
  BucketeerContext,
  useBooleanVariation,
  useStringVariation,
  useNumberVariation,
  useObjectVariation,
  useBucketeerClient,
} from '../index';

describe('React Native Bucketeer SDK', () => {
  it('should export all required components and hooks', () => {
    expect(BucketeerProvider).toBeDefined();
    expect(BucketeerContext).toBeDefined();
    expect(useBooleanVariation).toBeDefined();
    expect(useStringVariation).toBeDefined();
    expect(useNumberVariation).toBeDefined();
    expect(useObjectVariation).toBeDefined();
    expect(useBucketeerClient).toBeDefined();
  });
});
