import {
  defineBKTConfig,
  defineBKTUser,
  initializeBKTClient,
} from 'bkt-js-client-sdk';
import uuid from 'react-native-uuid';

export async function initBKTSDK(): Promise<void> {
  const config = defineBKTConfig({
    apiKey: 'test_api_key',
    apiEndpoint: 'https://api.bucketeer.io',
    appVersion: '0.0.1',
    featureTag: 'javascript',
    idGenerator: new ReactNativeIdGenerator(),
    fetch: fetch,
  });
  const user = defineBKTUser({
    id: '001',
  });
  return initializeBKTClient(config, user, 1000);
}

export function multiply(a: number, b: number): number {
  return a * b;
}

class ReactNativeIdGenerator {
  newId(): string {
    return uuid.v4();
  }
}
