import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import {
  BucketeerProvider,
  defineBKTConfigForReactNative,
  useStringVariation,
  initializeBKTClient,
  type BKTClient,
  destroyBKTClient,
  getBKTClient,
  defineBKTUser,
} from 'bkt-react-native-client-sdk';

const API_ENDPOINT = `${process.env.BKT_API_ENDPOINT}`;
const API_KEY = `${process.env.BKT_API_KEY}`;
const FEATURE_TAG = 'javascript';
const USER_ID = 'USER_ID'; // Replace with your user ID

const config = defineBKTConfigForReactNative({
  apiKey: API_KEY,
  apiEndpoint: API_ENDPOINT,
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
  const theme = useStringVariation('app-theme', 'dark');
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
        Theme: {theme}
      </Text>
      <Text
        style={[
          styles.desc,
          isDark ? styles.textHintDark : styles.textHintLight,
        ]}>
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Initializing Bucketeer Client...</Text>
          <Text style={styles.desc}>
            Please wait while the client is being initialized.
          </Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.safeArea}>
        <BucketeerProvider client={client}>
          <AppContent />
        </BucketeerProvider>
      </SafeAreaView>
    );
  }
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
