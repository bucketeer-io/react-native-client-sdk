import { useEffect, useState } from 'react';
import { initBKTSDK } from '@bucketeer/react-native-client-sdk';
import { Text, View, StyleSheet } from 'react-native';
import { getBKTClient } from 'bkt-js-client-sdk';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initBKTSDK();
        setInitialized(true);
        console.log('Bucketeer SDK initialized successfully');
        const client = getBKTClient();
        const evaluation = await client!.stringVariation(
          'feature-js-e2e-string',
          'default'
        );
        console.log('Evaluation result:', evaluation);
        setResult(evaluation);
      } catch (error) {
        console.error('Failed to initialize Bucketeer SDK:', error);
      }
    };
    initialize();
  }, []);

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
