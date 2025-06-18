import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BucketeerProvider,
  defineReactNativeBKTConfig,
  useStringVariation,
} from '@bucketeer/react-native-client-sdk';
import { defineBKTUser } from 'bkt-js-client-sdk';
import TestScreen from './TestScreen';

const API_ENDPOINT = 'https://api-dev.bucketeer.jp';
const API_KEY =
  '68f36f74aed68a63c6a0de5cf2de2f343c3714c0d1be4083f8fa679a39644a7c';

const config = defineReactNativeBKTConfig({
  apiKey: API_KEY, //'your-api-key',
  apiEndpoint: API_ENDPOINT, //'https://api.bucketeer.io',
  appVersion: '1.0.0',
  featureTag: 'mobile',
});

const user = defineBKTUser({
  id: 'rn-e2e-user-123',
  customAttributes: {
    platform: 'ios',
    version: '1.0.0',
  },
});

function AppContent() {
  const [currentScreen, setCurrentScreen] = React.useState<'demo' | 'test'>(
    'demo'
  );

  if (currentScreen === 'test') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID="back-to-demo-button"
          style={styles.navButton}
          onPress={() => setCurrentScreen('demo')}
        >
          <Text style={styles.navButtonText}>← Back to Demo</Text>
        </TouchableOpacity>
        <TestScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="open-test-screen-button"
        style={styles.navButton}
        onPress={() => setCurrentScreen('test')}
      >
        <Text style={styles.navButtonText}>Open E2E Test Screen →</Text>
      </TouchableOpacity>
      <FeatureFlagDemo />
    </View>
  );
}

function FeatureFlagDemo() {
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
        ]}
      >
        (Change the 'app-theme' feature flag value to see the effect)
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <BucketeerProvider config={config} user={user}>
      <AppContent />
    </BucketeerProvider>
  );
}

const styles = StyleSheet.create({
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
