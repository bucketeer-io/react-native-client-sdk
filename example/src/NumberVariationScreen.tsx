import { View, Text, ScrollView } from 'react-native';
import {
  useBucketeerClient,
  useNumberVariation,
  useNumberVariationDetails,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_INT } from '../../e2e/constants';
import { DetailRow } from './DetailRow';
import { styles } from './styles';

export default function NumberVariationScreen() {
  const client = useBucketeerClient();

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
