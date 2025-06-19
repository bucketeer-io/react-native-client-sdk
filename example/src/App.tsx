import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  BucketeerProvider,
  defineReactNativeBKTConfig,
  useStringVariation,
} from '@bucketeer/react-native-client-sdk';
import { defineBKTUser } from 'bkt-js-client-sdk';
import StringVariationScreen from './StringVariationScreen';
import BooleanVariationScreen from './BooleanVariationScreen';
import NumberVariationScreen from './NumberVariationScreen';
import ObjectVariationScreen from './ObjectVariationScreen';
import { FEATURE_TAG, USER_ID } from '../../e2e/constants';

const API_ENDPOINT =
  process.env.EXPO_PUBLIC_BKT_API_ENDPOINT || 'https://api.bucketeer.io';
const API_KEY = process.env.EXPO_PUBLIC_BKT_API_KEY || 'api-key';

const config = defineReactNativeBKTConfig({
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
    <SafeAreaView style={styles.safeArea}>
      <BucketeerProvider config={config} user={user}>
        <AppContent />
      </BucketeerProvider>
    </SafeAreaView>
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
