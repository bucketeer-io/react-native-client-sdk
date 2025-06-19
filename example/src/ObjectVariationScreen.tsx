import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  useObjectVariation,
  useObjectVariationDetails,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_JSON } from '../../e2e/constants';
import { DetailRow } from './DetailRow';

export default function ObjectVariationScreen() {
  const { client } = useBucketeerClient();

  const objectValue = useObjectVariation<{ key: string }>(FEATURE_ID_JSON, {
    key: 'default',
  });
  const objectDetails = useObjectVariationDetails<{ key: string }>(
    FEATURE_ID_JSON,
    { key: 'default' }
  );

  return (
    <ScrollView style={styles.container}>
      {/* SDK Ready Indicator */}
      <View style={styles.header}>
        <Text testID="sdk-ready" style={styles.readyText}>
          SDK Ready: {client ? '✅' : '⏳'}
        </Text>
      </View>

      {/* Object Variation Section */}
      <View style={styles.variationSection}>
        <Text style={styles.variationTitle}>Object Variation</Text>

        <View style={styles.valueContainer}>
          <Text testID="object-flag-value" style={styles.value}>
            Value: {JSON.stringify(objectValue)}
          </Text>
          <Text testID="key-value" style={styles.objectDetail}>
            Key: {objectValue.key}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Object Variation Details:</Text>
          <DetailRow
            label="Feature ID"
            value={objectDetails.featureId}
            testID="object-details-feature-id"
          />
          <DetailRow
            label="Feature Version"
            value={objectDetails.featureVersion}
            testID="object-details-feature-version"
          />
          <DetailRow
            label="User ID"
            value={objectDetails.userId}
            testID="object-details-user-id"
          />
          <DetailRow
            label="Variation ID"
            value={objectDetails.variationId}
            testID="object-details-variation-id"
          />
          <DetailRow
            label="Variation Name"
            value={objectDetails.variationName}
            testID="object-details-variation-name"
          />
          <DetailRow
            label="Variation Value"
            value={JSON.stringify(objectDetails.variationValue)}
            testID="object-details-variation-value"
          />
          <DetailRow
            label="Reason"
            value={objectDetails.reason}
            testID="object-details-variation-reason"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
    borderBottomColor: '#9b59b6',
    paddingBottom: 8,
  },
  valueContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
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
  objectDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
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
