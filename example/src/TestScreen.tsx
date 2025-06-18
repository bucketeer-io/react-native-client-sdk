import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  useStringVariation,
  useBooleanVariation,
  useNumberVariation,
  useObjectVariation,
  useStringVariationDetails,
  useBooleanVariationDetails,
  useNumberVariationDetails,
  useObjectVariationDetails,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import {
  FEATURE_ID_STRING,
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_INT,
  FEATURE_ID_JSON,
} from '../../e2e/constants';

interface VariationSectionProps {
  title: string;
  children: React.ReactNode;
}

function VariationSection({ title, children }: VariationSectionProps) {
  return (
    <View style={styles.variationSection}>
      <Text style={styles.variationTitle}>{title}</Text>
      {children}
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: string | number;
  testID: string;
}

function DetailRow({ label, value, testID }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text testID={testID} style={styles.detailValue}>
        {String(value)}
      </Text>
    </View>
  );
}

export default function TestScreen() {
  const { client } = useBucketeerClient();

  // Feature flag value hooks (following JS SDK pattern)
  const stringValue = useStringVariation(FEATURE_ID_STRING, 'default-string');
  const booleanValue = useBooleanVariation(FEATURE_ID_BOOLEAN, false);
  const numberValue = useNumberVariation(FEATURE_ID_INT, 0);
  const objectValue = useObjectVariation<{ key: string }>(FEATURE_ID_JSON, {
    key: 'default',
  });

  // Feature flag detail hooks (following JS SDK pattern)
  const stringDetails = useStringVariationDetails(FEATURE_ID_STRING, 'default');
  const booleanDetails = useBooleanVariationDetails(FEATURE_ID_BOOLEAN, false);
  const numberDetails = useNumberVariationDetails(FEATURE_ID_INT, 0);
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

      {/* String Variation Section */}
      <VariationSection title="String Variation">
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Value:</Text>
          <Text testID="string-flag-value" style={styles.value}>
            {stringValue}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>String Variation Details:</Text>
          <DetailRow
            label="Feature ID"
            value={stringDetails.featureId}
            testID="string-feature-id"
          />
          <DetailRow
            label="Feature Version"
            value={stringDetails.featureVersion}
            testID="string-feature-version"
          />
          <DetailRow
            label="User ID"
            value={stringDetails.userId}
            testID="string-user-id"
          />
          <DetailRow
            label="Variation ID"
            value={stringDetails.variationId}
            testID="string-variation-id"
          />
          <DetailRow
            label="Variation Name"
            value={stringDetails.variationName}
            testID="string-variation-name"
          />
          <DetailRow
            label="Variation Value"
            value={stringDetails.variationValue}
            testID="string-variation-value"
          />
          <DetailRow
            label="Reason"
            value={stringDetails.reason}
            testID="string-reason"
          />
        </View>
      </VariationSection>

      {/* Boolean Variation Section */}
      <VariationSection title="Boolean Variation">
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Value:</Text>
          <View style={styles.booleanValueContainer}>
            <Text testID="boolean-flag-value" style={styles.value}>
              {String(booleanValue)}
            </Text>
            {booleanValue && (
              <View testID="boolean-feature" style={styles.booleanFeature}>
                <Text style={styles.booleanFeatureText}>
                  🎉 Feature Enabled
                </Text>
              </View>
            )}
            {!booleanValue && (
              <Text testID="boolean-disabled" style={styles.booleanDisabled}>
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
            testID="boolean-feature-id"
          />
          <DetailRow
            label="Feature Version"
            value={booleanDetails.featureVersion}
            testID="boolean-feature-version"
          />
          <DetailRow
            label="User ID"
            value={booleanDetails.userId}
            testID="boolean-user-id"
          />
          <DetailRow
            label="Variation ID"
            value={booleanDetails.variationId}
            testID="boolean-variation-id"
          />
          <DetailRow
            label="Variation Name"
            value={booleanDetails.variationName}
            testID="boolean-variation-name"
          />
          <DetailRow
            label="Variation Value"
            value={String(booleanDetails.variationValue)}
            testID="boolean-variation-value"
          />
          <DetailRow
            label="Reason"
            value={booleanDetails.reason}
            testID="boolean-reason"
          />
        </View>
      </VariationSection>

      {/* Number Variation Section */}
      <VariationSection title="Number Variation">
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Value:</Text>
          <Text testID="number-flag-value" style={styles.value}>
            {numberValue}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Number Variation Details:</Text>
          <DetailRow
            label="Feature ID"
            value={numberDetails.featureId}
            testID="number-feature-id"
          />
          <DetailRow
            label="Feature Version"
            value={numberDetails.featureVersion}
            testID="number-feature-version"
          />
          <DetailRow
            label="User ID"
            value={numberDetails.userId}
            testID="number-user-id"
          />
          <DetailRow
            label="Variation ID"
            value={numberDetails.variationId}
            testID="number-variation-id"
          />
          <DetailRow
            label="Variation Name"
            value={numberDetails.variationName}
            testID="number-variation-name"
          />
          <DetailRow
            label="Variation Value"
            value={numberDetails.variationValue}
            testID="number-variation-value"
          />
          <DetailRow
            label="Reason"
            value={numberDetails.reason}
            testID="number-reason"
          />
        </View>
      </VariationSection>

      {/* Object Variation Section */}
      <VariationSection title="Object Variation">
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Value:</Text>
          <Text testID="object-flag-value" style={styles.value}>
            {JSON.stringify(objectValue)}
          </Text>
          <Text testID="object-key-value" style={styles.objectDetail}>
            Key: {objectValue.key}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Object Variation Details:</Text>
          <DetailRow
            label="Feature ID"
            value={objectDetails.featureId}
            testID="object-feature-id"
          />
          <DetailRow
            label="Feature Version"
            value={objectDetails.featureVersion}
            testID="object-feature-version"
          />
          <DetailRow
            label="User ID"
            value={objectDetails.userId}
            testID="object-user-id"
          />
          <DetailRow
            label="Variation ID"
            value={objectDetails.variationId}
            testID="object-variation-id"
          />
          <DetailRow
            label="Variation Name"
            value={objectDetails.variationName}
            testID="object-variation-name"
          />
          <DetailRow
            label="Variation Value"
            value={JSON.stringify(objectDetails.variationValue)}
            testID="object-variation-value"
          />
          <DetailRow
            label="Reason"
            value={objectDetails.reason}
            testID="object-reason"
          />
        </View>
      </VariationSection>
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 2,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
});
