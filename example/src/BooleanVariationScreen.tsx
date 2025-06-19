import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  useBooleanVariation,
  useBooleanVariationDetails,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_BOOLEAN } from '../../e2e/constants';
import { DetailRow } from './DetailRow';

export default function BooleanVariationScreen() {
  const { client } = useBucketeerClient();

  const booleanValue = useBooleanVariation(FEATURE_ID_BOOLEAN, false);
  const booleanDetails = useBooleanVariationDetails(FEATURE_ID_BOOLEAN, false);

  return (
    <ScrollView style={styles.container}>
      {/* SDK Ready Indicator */}
      <View style={styles.header}>
        <Text testID="sdk-ready" style={styles.readyText}>
          SDK Ready: {client ? '✅' : '⏳'}
        </Text>
      </View>

      {/* Boolean Variation Section */}
      <View style={styles.variationSection}>
        <Text style={styles.variationTitle}>Boolean Variation</Text>

        <View style={styles.valueContainer}>
          <View style={styles.booleanValueContainer}>
            <Text testID="boolean-flag-value" style={styles.value}>
              Value: {String(booleanValue)}
            </Text>
            {booleanValue && (
              <View testID="feature-enabled" style={styles.booleanFeature}>
                <Text style={styles.booleanFeatureText}>
                  🎉 Feature Enabled
                </Text>
              </View>
            )}
            {!booleanValue && (
              <Text testID="feature-disabled" style={styles.booleanDisabled}>
                Feature Disabled
              </Text>
            )}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Boolean Variation Details:</Text>
          <DetailRow
            label="Feature ID"
            value={booleanDetails.featureId}
            testID="boolean-details-feature-id"
          />
          <DetailRow
            label="Feature Version"
            value={booleanDetails.featureVersion}
            testID="boolean-details-feature-version"
          />
          <DetailRow
            label="User ID"
            value={booleanDetails.userId}
            testID="boolean-details-user-id"
          />
          <DetailRow
            label="Variation ID"
            value={booleanDetails.variationId}
            testID="boolean-details-variation-id"
          />
          <DetailRow
            label="Variation Name"
            value={booleanDetails.variationName}
            testID="boolean-details-variation-name"
          />
          <DetailRow
            label="Variation Value"
            value={String(booleanDetails.variationValue)}
            testID="boolean-details-variation-value"
          />
          <DetailRow
            label="Reason"
            value={booleanDetails.reason}
            testID="boolean-details-variation-reason"
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
    borderBottomColor: '#e74c3c',
    paddingBottom: 8,
  },
  valueContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
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
  booleanValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  booleanFeature: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#2ecc71',
    borderRadius: 6,
  },
  booleanFeatureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  booleanDisabled: {
    marginLeft: 12,
    color: '#e74c3c',
    fontSize: 14,
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
