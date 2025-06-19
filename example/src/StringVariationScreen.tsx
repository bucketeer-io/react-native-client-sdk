import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import {
  useStringVariation,
  useStringVariationDetails,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_STRING } from '../../e2e/constants';
import { DetailRow } from './DetailRow';

export default function StringVariationScreen() {
  const { client } = useBucketeerClient();

  const stringValue = useStringVariation(FEATURE_ID_STRING, 'default-string');
  const stringDetails = useStringVariationDetails(FEATURE_ID_STRING, 'default');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* SDK Ready Indicator */}
        <View style={styles.header}>
          <Text testID="sdk-ready" style={styles.readyText}>
            SDK Ready: {client ? '✅' : '⏳'}
          </Text>
        </View>

        {/* String Variation Section */}
        <View style={styles.variationSection}>
          <Text style={styles.variationTitle}>String Variation</Text>

          <View style={styles.valueContainer}>
            <Text testID="string-flag-value" style={styles.value}>
              Value: {stringValue}
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>String Variation Details:</Text>
            <DetailRow
              label="Feature ID"
              value={stringDetails.featureId}
              testID="string-details-feature-id"
            />
            <DetailRow
              label="Feature Version"
              value={stringDetails.featureVersion}
              testID="string-details-feature-version"
            />
            <DetailRow
              label="User ID"
              value={stringDetails.userId}
              testID="string-details-user-id"
            />
            <DetailRow
              label="Variation ID"
              value={stringDetails.variationId}
              testID="string-details-variation-id"
            />
            <DetailRow
              label="Variation Name"
              value={stringDetails.variationName}
              testID="string-details-variation-name"
            />
            <DetailRow
              label="Variation Value"
              value={stringDetails.variationValue}
              testID="string-details-variation-value"
            />
            <DetailRow
              label="Reason"
              value={stringDetails.reason}
              testID="string-details-variation-reason"
            />
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    alignItems: 'center',
  },
  readyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  variationSection: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  variationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 8,
  },
  valueContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailsContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
});
