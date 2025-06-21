# @bucketeer/react-native-client-sdk

A React Native SDK for Bucketeer feature flags, providing React hooks and components for easy integration.  
**Built on top of [@bucketeer/react-client-sdk](https://github.com/bucketeer-io/react-client-sdk).**

## Key Points

- Most APIs and usage are identical to the React SDK.
- The main difference: use `defineReactNativeBKTConfig` to build your configuration.

## Installation

```sh
npm install @bucketeer/react-native-client-sdk
```

## Usage

Wrap your app with the `BucketeerProvider` and use `defineReactNativeBKTConfig`:

```tsx
import React from 'react';
import { BucketeerProvider, defineReactNativeBKTConfig } from '@bucketeer/react-native-client-sdk';
import { defineBKTUser } from 'bkt-js-client-sdk';

const config = defineReactNativeBKTConfig({
  apiKey: 'your-api-key',
  apiEndpoint: 'https://api.bucketeer.io',
  appVersion: '1.0.0',
  featureTag: 'mobile',
});

const user = defineBKTUser({
  id: 'user-123',
  customAttributes: {
    platform: 'ios',
    version: '1.0.0',
  },
});

export default function App() {
  return (
    <BucketeerProvider config={config} user={user}>
      <YourAppContent />
    </BucketeerProvider>
  );
}
```

## API Reference

This SDK re-exports all APIs from the React SDK.  
For detailed API usage, see the [@bucketeer/react-client-sdk documentation](https://github.com/bucketeer-io/react-client-sdk/blob/main/README.md#usage).

## License

Apache 2.0