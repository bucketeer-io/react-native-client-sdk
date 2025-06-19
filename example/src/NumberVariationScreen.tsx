import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  useNumberVariation,
  useNumberVariationDetails,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_INT } from '../../e2e/constants';
import { DetailRow } from './DetailRow';

export default function NumberVariationScreen() {
  const { client } = useBucketeerClient();

  const numberValue = useNumberVariation(FEATURE_ID_INT, 0);
  const numberDetails = useNumberVariationDetails(FEATURE_ID_INT, 0);

  return (
    <ScrollView style={styles.container}>
      {/* SDK Ready Indicator */}
      <View style={styles.header}>
        <Text testID="sdk-ready" style={styles.readyText}>
          SDK Ready: {client ? '✅' : '⏳'}
        </Text>
      </View>

      {/* Number Variation Section */}
      <View style={styles.variationSection}>
        <Text style={styles.variationTitle}>Number Variation</Text>

        <View style={styles.valueContainer}>
          <Text testID="number-flag-value" style={styles.value}>
            Value: {numberValue}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Number Variation Details:</Text>
          <DetailRow
            label="Feature ID"
            value={numberDetails.featureId}
            testID="number-details-feature-id"
          />
          <DetailRow
            label="Feature Version"
            value={numberDetails.featureVersion}
            testID="number-details-feature-version"
          />
          <DetailRow
            label="User ID"
            value={numberDetails.userId}
            testID="number-details-user-id"
          />
          <DetailRow
            label="Variation ID"
            value={numberDetails.variationId}
            testID="number-details-variation-id"
          />
          <DetailRow
            label="Variation Name"
            value={numberDetails.variationName}
            testID="number-details-variation-name"
          />
          <DetailRow
            label="Variation Value"
            value={numberDetails.variationValue}
            testID="number-details-variation-value"
          />
          <DetailRow
            label="Reason"
            value={numberDetails.reason}
            testID="number-details-variation-reason"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    borderBottomColor: '#f39c12',
    paddingBottom: 8,
  },
  valueContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
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
