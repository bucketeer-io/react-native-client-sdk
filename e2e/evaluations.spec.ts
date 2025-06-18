import { device, element, by, expect, waitFor } from 'detox';

describe('E2E Feature Flag Evaluations', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();

    // Navigate to test screen
    await element(by.id('open-test-screen-button')).tap();

    // Wait for SDK initialization
    await waitFor(element(by.text('SDK Ready: ✅')))
      .toBeVisible()
      .withTimeout(15000);
  });

  afterEach(async () => {
    // Go back to home screen
    await device.sendToHome();
  });

  describe('stringVariation', () => {
    it('should return correct string value', async () => {
      // JS SDK equivalent: expect(client.stringVariation(FEATURE_ID_STRING, '')).toBe('value-1')
      await expect(element(by.id('string-flag-value'))).toHaveText('value-1');
    });

    it('should show correct string variation details', async () => {
      // JS SDK equivalent: expect(client.stringVariationDetails(FEATURE_ID_STRING, 'default'))
      //   .toStrictEqual({ featureId, featureVersion, userId, variationId, variationName, variationValue, reason })

      await expect(element(by.id('string-feature-id'))).toHaveText(
        'feature-rn-e2e-string'
      );
      await expect(element(by.id('string-feature-version'))).toBeVisible();
      await expect(element(by.id('string-user-id'))).toHaveText(
        'rn-e2e-user-123'
      );
      await expect(element(by.id('string-variation-id'))).toBeVisible();
      await expect(element(by.id('string-variation-name'))).toBeVisible();
      await expect(element(by.id('string-variation-value'))).toHaveText(
        'value-1'
      );
      await expect(element(by.id('string-reason'))).toHaveText('DEFAULT');
    });
  });

  describe('booleanVariation', () => {
    it('should return correct boolean value', async () => {
      // JS SDK equivalent: expect(client.booleanVariation(FEATURE_ID_BOOLEAN, false)).toBe(true)
      await expect(element(by.id('boolean-flag-value'))).toHaveText('true');
      await expect(element(by.id('boolean-feature'))).toBeVisible();
    });

    it('should show correct boolean variation details', async () => {
      // JS SDK equivalent: expect(client.booleanVariationDetails(FEATURE_ID_BOOLEAN, false))
      //   .toStrictEqual({ featureId, featureVersion, userId, variationId, variationName, variationValue, reason })

      await expect(element(by.id('boolean-feature-id'))).toHaveText(
        'feature-rn-e2e-boolean'
      );
      await expect(element(by.id('boolean-feature-version'))).toBeVisible();
      await expect(element(by.id('boolean-user-id'))).toHaveText(
        'rn-e2e-user-123'
      );
      await expect(element(by.id('boolean-variation-id'))).toBeVisible();
      await expect(element(by.id('boolean-variation-name'))).toBeVisible();
      await expect(element(by.id('boolean-variation-value'))).toHaveText(
        'true'
      );
      await expect(element(by.id('boolean-reason'))).toHaveText('DEFAULT');
    });

    it('should hide feature when flag is false', async () => {
      // This would test the opposite case - when flag is false in staging
      // await expect(element(by.id('boolean-disabled'))).toBeVisible();
    });
  });

  describe('numberVariation', () => {
    describe('integer', () => {
      it('should return correct number value', async () => {
        // JS SDK equivalent: expect(client.numberVariation(FEATURE_ID_INT, 0)).toBe(10)
        await expect(element(by.id('number-flag-value'))).toHaveText('10');
      });

      it('should show correct number variation details', async () => {
        // JS SDK equivalent: expect(client.numberVariationDetails(FEATURE_ID_INT, 0))
        //   .toStrictEqual({ featureId, featureVersion, userId, variationId, variationName, variationValue, reason })

        await expect(element(by.id('number-feature-id'))).toHaveText(
          'rn-e2e-number'
        );
        await expect(element(by.id('number-feature-version'))).toBeVisible();
        await expect(element(by.id('number-user-id'))).toHaveText(
          'rn-e2e-user-123'
        );
        await expect(element(by.id('number-variation-id'))).toBeVisible();
        await expect(element(by.id('number-variation-name'))).toBeVisible();
        await expect(element(by.id('number-variation-value'))).toHaveText('10');
        await expect(element(by.id('number-reason'))).toHaveText('DEFAULT');
      });
    });

    // Note: For double/float testing, you would create a separate flag
    // describe('double', () => { ... });
  });

  describe('objectVariation', () => {
    it('should return correct object value', async () => {
      // JS SDK equivalent: expect(client.objectVariation(FEATURE_ID_JSON, '')).toStrictEqual({key: 'value-1'})
      await expect(element(by.id('object-flag-value'))).toHaveText(
        '{"key":"value-1"}'
      );
      await expect(element(by.id('object-key-value'))).toHaveText(
        'Key: value-1'
      );
    });

    it('should show correct object variation details', async () => {
      // JS SDK equivalent: expect(client.objectVariationDetails(FEATURE_ID_JSON, {}))
      //   .toStrictEqual({ featureId, featureVersion, userId, variationId, variationName, variationValue, reason })

      await expect(element(by.id('object-feature-id'))).toHaveText(
        'rn-e2e-object'
      );
      await expect(element(by.id('object-feature-version'))).toBeVisible();
      await expect(element(by.id('object-user-id'))).toHaveText(
        'rn-e2e-user-123'
      );
      await expect(element(by.id('object-variation-id'))).toBeVisible();
      await expect(element(by.id('object-variation-name'))).toBeVisible();
      await expect(element(by.id('object-variation-value'))).toHaveText(
        '{"key":"value-1"}'
      );
      await expect(element(by.id('object-reason'))).toHaveText('DEFAULT');
    });
  });

  // describe('AsyncStorage persistence', () => {
  //   it('should persist flags across app restarts', async () => {
  //     // Verify initial flag values
  //     await expect(element(by.id('string-flag-value'))).toHaveText('value-1');
  //     await expect(element(by.id('boolean-flag-value'))).toHaveText('true');
  //     await expect(element(by.id('number-flag-value'))).toHaveText('10');

  //     // Restart the app
  //     await device.reloadReactNative();
  //     await element(by.id('open-test-screen-button')).tap();

  //     // Should show cached values immediately (before API call completes)
  //     await expect(element(by.id('string-flag-value'))).toHaveText('value-1');
  //     await expect(element(by.id('boolean-flag-value'))).toHaveText('true');
  //     await expect(element(by.id('number-flag-value'))).toHaveText('10');
  //   });
  // });

  // describe('evaluation details consistency', () => {
  //   it('should have consistent evaluation details across all variation types', async () => {
  //     // Verify all variations have the same basic evaluation metadata
  //     await expect(element(by.id('string-user-id'))).toHaveText(
  //       'rn-e2e-user-123'
  //     );
  //     await expect(element(by.id('boolean-user-id'))).toHaveText(
  //       'rn-e2e-user-123'
  //     );
  //     await expect(element(by.id('number-user-id'))).toHaveText(
  //       'rn-e2e-user-123'
  //     );
  //     await expect(element(by.id('object-user-id'))).toHaveText(
  //       'rn-e2e-user-123'
  //     );

  //     // Verify all have DEFAULT reason (assuming test flags are set up this way)
  //     await expect(element(by.id('string-reason'))).toHaveText('DEFAULT');
  //     await expect(element(by.id('boolean-reason'))).toHaveText('DEFAULT');
  //     await expect(element(by.id('number-reason'))).toHaveText('DEFAULT');
  //     await expect(element(by.id('object-reason'))).toHaveText('DEFAULT');
  //   });
  // });
});
