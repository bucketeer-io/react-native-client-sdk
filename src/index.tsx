import {
  defineBKTConfig,
  defineBKTUser,
  initializeBKTClient,
} from '@bucketeer/js-client-sdk';

export async function initBKTSDK(): Promise<void> {
  const config = defineBKTConfig({
    apiKey: '',
    apiEndpoint: '',
    appVersion: '0.0.1',
    featureTag: 'javascript',
  });
  const user = defineBKTUser({
    id: '001',
  });
  return initializeBKTClient(config, user, 1000);
}

export function multiply(a: number, b: number): number {
  return a * b;
}
