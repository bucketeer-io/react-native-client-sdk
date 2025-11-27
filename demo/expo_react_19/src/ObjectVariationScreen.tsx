import { View, Text, ScrollView } from 'react-native';
import {
  useBucketeerClient,
  useObjectVariation,
  useObjectVariationDetails,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_JSON } from '../../../e2e/constants';
import { DetailRow } from './DetailRow';
import { styles } from './styles';

export default function ObjectVariationScreen() {
  const client = useBucketeerClient();

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
