import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [initialized] = useState(false);
  const [result] = useState<string | null>(null);

  useEffect(() => {}, []);

  if (!initialized) {
    return (
      <View style={styles.container}>
        <Text>Initializing Bucketeer SDK...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Demo React Native SDK - Expo Go!</Text>
      <Text>TAG: javascript</Text>
      <Text>FID: feature-js-e2e-string</Text>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
