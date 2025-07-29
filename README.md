# @bucketeer/react-native-client-sdk

This SDK enables seamless access to your feature flags in React Native applications using [Bucketeer](https://bucketeer.io/). It provides React hooks and components for easy integration, and is built on top of the robust `@bucketeer/react-client-sdk` and `@bucketeer/js-client-sdk`.

[Bucketeer](https://bucketeer.io) is an open-source platform created by [CyberAgent](https://www.cyberagent.co.jp/en/) to help teams make better decisions, reduce deployment lead time and release risk through feature flags. Bucketeer offers advanced features like dark launches and staged rollouts that perform limited releases based on user attributes, devices, and other segments.

> [!WARNING]
> This is a beta version. Breaking changes may be introduced before general release.

For documentation related to flags management in Bucketeer, refer to the [Bucketeer documentation website](https://docs.bucketeer.io/sdk/client-side/javascript).


## Key Points

- Most APIs and usage are identical to the React SDK.
- The main difference: make sure use `defineBKTConfigForReactNative` to build your configuration.

## Installation

```sh
npm install @bucketeer/react-native-client-sdk
```

### AsyncStorage Dependency

This SDK uses `@react-native-async-storage/async-storage` for bootstrapping, which is a native dependency. If you don't have it installed, the evaluation will not be cached between app restarts.

**For Expo projects:**
Adding the Bucketeer React Native SDK from npm and re-running `pod install` should suffice.
If it doesn't work, you may need to install `@react-native-async-storage/async-storage` as a dependency in your project.

```sh
npx expo install @react-native-async-storage/async-storage
```
**For bare React Native projects:**
You'll need to explicitly add `@react-native-async-storage/async-storage` as a dependency to your project and re-run `pod install` for auto-linking to work. This is because auto-linking does not work with transitive dependencies.

```sh
npm install @react-native-async-storage/async-storage
cd ios && pod install  # For iOS
```

For more details, see: https://react-native-async-storage.github.io/async-storage/docs/install/

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
    // Cleanup client on unmount or when necessary
    return () => {
      destroyBKTClient();
    };
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

0.0.16 React 18
0.0.17 React 19