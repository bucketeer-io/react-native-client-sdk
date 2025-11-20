import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BucketeerProvider,
  defineBKTConfigForReactNative,
  useStringVariation,
  initializeBKTClient,
  type BKTClient,
  destroyBKTClient,
  getBKTClient,
  defineBKTUser,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import StringVariationScreen from './StringVariationScreen';
import BooleanVariationScreen from './BooleanVariationScreen';
import NumberVariationScreen from './NumberVariationScreen';
import ObjectVariationScreen from './ObjectVariationScreen';
import { FEATURE_TAG, USER_ID } from '../../../e2e/constants';

const API_ENDPOINT =
  process.env.EXPO_PUBLIC_BKT_API_ENDPOINT || 'https://api.bucketeer.io';
const API_KEY = process.env.EXPO_PUBLIC_BKT_API_KEY || 'api-key';

const config = defineBKTConfigForReactNative({
  apiKey: API_KEY, //'your-api-key',
  apiEndpoint: API_ENDPOINT, //'https://api.bucketeer.io',
  appVersion: '1.0.0',
  featureTag: FEATURE_TAG,
});

const user = defineBKTUser({
  id: USER_ID,
  customAttributes: {
    platform: 'react-native',
    version: '1.0.0',
  },
});

function AppContent() {
  const [currentScreen, setCurrentScreen] = React.useState<
    'demo' | 'string' | 'boolean' | 'number' | 'object'
  >('demo');
  // There are two ways to use the Bucketeer client:
  // 1. First we get the Bucketeer client from context
  // This is the recommended way to access the client in your components.
  // Make sure to wrap your app/component with BucketeerProvider.
  const client = useBucketeerClient();
  // 2. Or we can use the getBKTClient() function to get the client directly
  // This is useful if you need to access the client outside of a React component.
  // Make sure to initialize the client before calling this function.
  // const client = getBKTClient();
  // Full BKTClient API reference: https://docs.bucketeer.io/sdk/client-side/javascript

  if (currentScreen === 'string') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID="back-to-demo-button"
          style={styles.navButton}
          onPress={() => setCurrentScreen('demo')}
        >
          <Text style={styles.navButtonText}>← Back to Demo</Text>
        </TouchableOpacity>
        <StringVariationScreen />
      </View>
    );
  }

  if (currentScreen === 'boolean') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID="back-to-demo-button"
          style={styles.navButton}
          onPress={() => setCurrentScreen('demo')}
        >
          <Text style={styles.navButtonText}>← Back to Demo</Text>
        </TouchableOpacity>
        <BooleanVariationScreen />
      </View>
    );
  }

  if (currentScreen === 'number') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID="back-to-demo-button"
          style={styles.navButton}
          onPress={() => setCurrentScreen('demo')}
        >
          <Text style={styles.navButtonText}>← Back to Demo</Text>
        </TouchableOpacity>
        <NumberVariationScreen />
      </View>
    );
  }

  if (currentScreen === 'object') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID="back-to-demo-button"
          style={styles.navButton}
          onPress={() => setCurrentScreen('demo')}
        >
          <Text style={styles.navButtonText}>← Back to Demo</Text>
        </TouchableOpacity>
        <ObjectVariationScreen />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FeatureFlagDemo />
      <TouchableOpacity
        testID="track-event-button"
        style={styles.navButton}
        onPress={async () => {
          if (client) {
            // Example of tracking an event
            // You can replace 'demo_event' and 1 with your actual event name and value
            client.track('demo_event', 1);
            console.log('Event tracked: demo_event');
          } else {
            console.warn('Bucketeer client is not initialized');
          }
        }}
      >
        <Text style={styles.navButtonText}>Track Event</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="open-string-screen-button"
        style={styles.navButton}
        onPress={() => setCurrentScreen('string')}
      >
        <Text style={styles.navButtonText}>String Variation →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="open-boolean-screen-button"
        style={styles.navButton}
        onPress={() => setCurrentScreen('boolean')}
      >
        <Text style={styles.navButtonText}>Boolean Variation →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="open-number-screen-button"
        style={styles.navButton}
        onPress={() => setCurrentScreen('number')}
      >
        <Text style={styles.navButtonText}>Number Variation →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="open-object-screen-button"
        style={styles.navButton}
        onPress={() => setCurrentScreen('object')}
      >
        <Text style={styles.navButtonText}>Object Variation →</Text>
      </TouchableOpacity>
    </View>
  );
}

function FeatureFlagDemo() {
  const theme = useStringVariation('app-theme', 'dark');
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
        React 19
      </Text>
      <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
        Theme: {theme}
      </Text>
      <Text
        style={[
          styles.desc,
          isDark ? styles.textHintDark : styles.textHintLight,
        ]}
      >
        (Change the 'app-theme' feature flag value to see the effect)
      </Text>
    </View>
  );
}

export default function App() {
  const [client, setClient] = useState<BKTClient | null>(null);
  useEffect(() => {
    const init = async () => {
      try {
        await initializeBKTClient(config, user);
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
      try {
        const bktClient = getBKTClient()!;
        setClient(bktClient);
      } catch (error) {
        console.error('Failed to initialize Bucketeer client:', error);
      }
    };

    init();

    // Cleanup listener on unmount
    return () => {
      destroyBKTClient();
    };
  }, []);
  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Initializing Bucketeer Client...</Text>
        <Text style={styles.desc}>
          Please wait while the client is being initialized.
        </Text>
      </View>
    );
  } else {
    return (
      <BucketeerProvider client={client}>
        <AppContent />
      </BucketeerProvider>
    );
  }
}

export function DumpView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dump View</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgDark: {
    backgroundColor: '#222',
  },
  bgLight: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textLight: {
    color: '#fff',
  },
  textDark: {
    color: '#222',
  },
  desc: {
    marginTop: 8,
  },
  textHintDark: {
    color: '#aaa',
  },
  textHintLight: {
    color: '#555',
  },
  navButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    margin: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
