import { View, Text, ScrollView } from 'react-native';
import {
  useBooleanVariation,
  useBooleanVariationDetails,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_BOOLEAN } from '../../e2e/constants';
import { DetailRow } from './DetailRow';
import { styles } from './styles';

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
