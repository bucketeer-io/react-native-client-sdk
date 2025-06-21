import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import {
  useStringVariation,
  useStringVariationDetails,
  useBucketeerClient,
} from '@bucketeer/react-native-client-sdk';
import { FEATURE_ID_STRING } from '../../e2e/constants';
import { DetailRow } from './DetailRow';
import { styles } from './styles';

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
