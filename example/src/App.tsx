import { useEffect, useState } from 'react';
import { multiply, initBKTSDK } from '@bucketeer/react-native-client-sdk';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initBKTSDK();
        setResult(multiply(3, 7));
        setInitialized(true);
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
