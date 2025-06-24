# @bucketeer/react-native-client-sdk

A React Native SDK for Bucketeer feature flags, providing React hooks and components for easy integration.  
**Built on top of [@bucketeer/react-client-sdk](https://github.com/bucketeer-io/react-client-sdk).**

## Key Points

- Most APIs and usage are identical to the React SDK.
- The main difference: use `defineBKTConfigForReactNative` to build your configuration.

## Installation

```sh
npm install @bucketeer/react-native-client-sdk
```

## Usage

Initialize the Bucketeer client and provide it to your app using the `BucketeerProvider`:

> Use `defineBKTConfigForReactNative` to create your config and `defineBKTUser` to create a user and initializing the client using `initializeBKTClient`

```tsx
import React, { useEffect, useState } from 'react';
import {
  BucketeerProvider,
  defineBKTConfigForReactNative,
  initializeBKTClient,
  getBKTClient,
  defineBKTUser,
  type BKTClient,
} from '@bucketeer/react-native-client-sdk';

const config = defineBKTConfigForReactNative({
  apiKey: 'your-api-key',
  apiEndpoint: 'https://api.bucketeer.io',
  appVersion: '1.0.0',
  featureTag: 'mobile',
});

const user = defineBKTUser({
  id: 'user-123',
  customAttributes: {
    platform: 'react-native',
    version: '1.0.0',
  },
});

export default function App() {
  const [client, setClient] = useState<BKTClient | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeBKTClient(config, user);
        const bktClient = getBKTClient();
        setClient(bktClient);
      } catch (error) {
                if (error instanceof Error && error.name === 'TimeoutException') {
          // TimeoutException but The BKTClient SDK has been initialized
          console.warn(
            'Bucketeer client initialization timed out, but client is already initialized.'
          );
        } else {
          console.error('Failed to initialize Bucketeer client:', error);
          return; // Exit early for non-timeout errors
        }
      }
    };

    init();
  }, []);

  if (!client) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <BucketeerProvider client={client}>
      <YourAppContent />
    </BucketeerProvider>
  );
}
```

> If you see a `TimeoutException` error during initialization, it means the Bucketeer client has already been initialized successfully. This error is safe to ignore and does not affect the client’s functionality.

## API Reference

This SDK re-exports all APIs from the React SDK.  
For detailed API usage, see the [@bucketeer/react-client-sdk documentation](https://github.com/bucketeer-io/react-client-sdk/blob/main/README.md#usage).

## License

Apache 2.0