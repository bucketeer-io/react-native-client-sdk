import { Text, View, StyleSheet } from 'react-native';
import {
  BucketeerProvider,
  defineReactNativeBKTConfig,
  useStringVariation,
} from '@bucketeer/react-native-client-sdk';
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

function FeatureFlagDemo() {
  const theme = useStringVariation('app-theme', 'light');
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
      <FeatureFlagDemo />
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
});
